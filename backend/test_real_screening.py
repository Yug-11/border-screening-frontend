import asyncio
import json
import uuid

import aiohttp
import websockets


DOCUMENT_PATH = r"E:\border-screening\backend\demo_document.jpg"
VERIFICATION_PATH = r"E:\border-screening\backend\demo_face.jpg"

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLW9mZmljZXItMDAxIiwicm9sZSI6Ik9GRklDRVIiLCJjaGVja3BvaW50IjoiREVMSEktREVNTy0wMSIsImV4cCI6MTc4ODk4NzU3OH0.epBCCOsxJn2yPNJzfBXu8q5MOyZr0vpcdzL6PHRZ6EM"


async def main():

    screening_id = str(uuid.uuid4())

    print("=" * 60)
    print("REAL BORDERGUARD SCREENING TEST")
    print("=" * 60)

    print(f"\nScreening ID: {screening_id}")

    ws_url = (
        f"ws://127.0.0.1:8000"
        f"/api/ws/screenings/{screening_id}"
    )

    print(f"WebSocket: {ws_url}")

    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    async with websockets.connect(
        ws_url,
        additional_headers=headers,
    ) as websocket:

        # --------------------------------------------------
        # WebSocket connection confirmation
        # --------------------------------------------------

        message = await websocket.recv()

        connection = json.loads(message)

        print("\nWebSocket connected:")
        print(connection)

        # --------------------------------------------------
        # Prepare screening request
        # --------------------------------------------------

        form = aiohttp.FormData()

        with open(DOCUMENT_PATH, "rb") as document_file:

            form.add_field(
                "document_image",
                document_file,
                filename="demo_document.jpg",
                content_type="image/jpeg",
            )

            with open(
                VERIFICATION_PATH,
                "rb",
            ) as verification_file:

                form.add_field(
                    "verification_image",
                    verification_file,
                    filename="demo_face.jpg",
                    content_type="image/jpeg",
                )

                print("\nStarting screening...\n")

                async with aiohttp.ClientSession(
                    headers=headers
                ) as session:

                    screening_task = asyncio.create_task(
                        session.post(
                            "http://127.0.0.1:8000/api/screenings",
                            data=form,
                            headers={
                                "X-Screening-ID": screening_id
                            },
                        )
                    )

                    # ------------------------------------------
                    # Receive real-time progress
                    # ------------------------------------------

                    while True:

                        message = await websocket.recv()

                        data = json.loads(message)

                        message_type = data.get(
                            "type"
                        )

                        if message_type != "screening_progress":
                            print(
                                "WS:",
                                data
                            )
                            continue

                        progress = data.get(
                            "progress",
                            0,
                        )

                        stage = data.get(
                            "stage",
                            "unknown",
                        )

                        status = data.get(
                            "status",
                            "unknown",
                        )

                        print(
                            f"[{progress:3}%] "
                            f"{stage:<25} "
                            f"-> {status}"
                        )

                        if progress >= 100:
                            break

                    # ------------------------------------------
                    # HTTP screening result
                    # ------------------------------------------

                    response = await screening_task

                    response_text = await response.text()

                    print("\n" + "=" * 60)
                    print("SCREENING HTTP RESULT")
                    print("=" * 60)

                    print(
                        f"\nHTTP Status: {response.status}"
                    )

                    try:

                        result = json.loads(
                            response_text
                        )

                        print(
                            json.dumps(
                                result,
                                indent=2,
                            )
                        )

                    except json.JSONDecodeError:

                        print(
                            response_text
                        )


if __name__ == "__main__":

    try:

        asyncio.run(
            main()
        )

    except KeyboardInterrupt:

        print(
            "\nTest cancelled."
        )

    except Exception as exc:

        print(
            "\nTEST FAILED:"
        )

        print(
            repr(exc)
        )