import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter()


class ScreeningConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

        # Event loop used by the FastAPI WebSocket server.
        self.loop = None

    async def connect(
        self,
        screening_id: str,
        websocket: WebSocket,
    ):
        await websocket.accept()

        # Store the server event loop.
        self.loop = asyncio.get_running_loop()

        if screening_id not in self.active_connections:
            self.active_connections[screening_id] = []

        self.active_connections[screening_id].append(
            websocket
        )

    def disconnect(
        self,
        screening_id: str,
        websocket: WebSocket,
    ):
        connections = self.active_connections.get(
            screening_id
        )

        if not connections:
            return

        if websocket in connections:
            connections.remove(websocket)

        if not connections:
            self.active_connections.pop(
                screening_id,
                None
            )

    async def send_update(
        self,
        screening_id: str,
        message: dict,
    ):
        connections = self.active_connections.get(
            screening_id,
            []
        )

        for connection in connections.copy():
            try:
                await connection.send_json(message)

            except Exception:
                self.disconnect(
                    screening_id,
                    connection
                )

    def send_update_sync(
        self,
        screening_id: str,
        message: dict,
    ):
        """
        Send a WebSocket update from synchronous
        backend code.

        create_screening() is synchronous, so it
        cannot directly await send_update().
        """

        if self.loop is None:
            return

        if not self.loop.is_running():
            return

        future = asyncio.run_coroutine_threadsafe(
            self.send_update(
                screening_id,
                message
            ),
            self.loop,
        )

        # Do not block the screening pipeline waiting
        # for the WebSocket client.
        return future


manager = ScreeningConnectionManager()


@router.websocket(
    "/api/ws/screenings/{screening_id}"
)
async def screening_websocket(
    websocket: WebSocket,
    screening_id: str,
):
    await manager.connect(
        screening_id,
        websocket
    )

    try:
        await websocket.send_json(
            {
                "type": "connection",
                "screening_id": screening_id,
                "status": "CONNECTED",
                "message": (
                    "Connected to screening "
                    "progress stream."
                ),
            }
        )

        while True:
            message = await websocket.receive_json()

            if message.get("type") == "ping":

                await websocket.send_json(
                    {
                        "type": "pong",
                        "screening_id": screening_id,
                    }
                )

    except WebSocketDisconnect:

        manager.disconnect(
            screening_id,
            websocket
        )

    except Exception:

        manager.disconnect(
            screening_id,
            websocket
        )