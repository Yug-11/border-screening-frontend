import { useEffect, useState } from 'react';

import { screeningSteps } from '../constants/screeningSteps';

import {
  createScreeningSocket,
  startScreening,
} from '../services/screeningService';

function createInitialSteps() {
  return screeningSteps.map((step) => ({
    ...step,
    status: 'pending',
    description: step.description || '',
  }));
}

function createEvent(
  title,
  variant = 'info',
  description = '',
) {
  return {
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString(),
    title,
    variant,
    description,
  };
}

function getStageIndex(stageId) {
  return screeningSteps.findIndex(
    (step) => step.id === stageId,
  );
}

export default function useScreeningProgress(
  documentFile,
  verificationFile = null,
) {
  const [status, setStatus] = useState(
    documentFile ? 'ready' : 'failed',
  );

  const [screeningId, setScreeningId] = useState(null);

  const [progress, setProgress] = useState(0);

  const [currentStage, setCurrentStage] = useState(null);

  const [steps, setSteps] = useState(
    createInitialSteps(),
  );

  const [events, setEvents] = useState([]);

  const [result, setResult] = useState(null);

  const [error, setError] = useState(
    documentFile
      ? ''
      : 'No document was provided. Return to document capture and try again.',
  );

  const [risk, setRisk] = useState('Pending');

  useEffect(() => {
    if (!documentFile) {
      setStatus('failed');
      setError(
        'No document was provided. Return to document capture and try again.',
      );
      return;
    }

    let cancelled = false;
    let socket = null;
    let activeScreeningId = null;

    async function beginScreening() {
      try {
        setStatus('running');
        setError('');
        setProgress(0);
        setResult(null);
        setRisk('Pending');

        setSteps(createInitialSteps());

        setEvents([
          createEvent(
            'Preparing screening',
            'info',
            verificationFile
              ? 'Preparing document and face verification analysis.'
              : 'The screening engine is preparing the document analysis.',
          ),
        ]);

        /*
         * Generate one ID for both:
         * - WebSocket
         * - HTTP screening request
         */
        activeScreeningId = crypto.randomUUID();

        if (cancelled) return;

        setScreeningId(activeScreeningId);

        /*
         * ---------------------------------------------------------
         * CONNECT WEBSOCKET FIRST
         * ---------------------------------------------------------
         */

        socket = createScreeningSocket(
          activeScreeningId,
        );

        if (cancelled) {
          socket.close();
          return;
        }

        socket.onopen = async () => {
          if (cancelled) {
            socket?.close();
            return;
          }

          setEvents((current) => [
            ...current,
            createEvent(
              'Connected to screening engine',
              'success',
              'Live screening progress channel established.',
            ),
          ]);

          /*
           * First stage becomes active.
           */
          setSteps((current) =>
            current.map((step, index) => ({
              ...step,
              status:
                index === 0
                  ? 'active'
                  : 'pending',
            })),
          );

          setCurrentStage(screeningSteps[0]);

          /*
           * -------------------------------------------------------
           * START ACTUAL BACKEND SCREENING
           * -------------------------------------------------------
           */

          try {
            const response = await startScreening({
              documentFile,
              verificationFile,
              screeningId: activeScreeningId,
            });

            if (cancelled) return;

            setResult(response);

            const backendRisk =
              response?.risk?.risk_level;

            if (backendRisk) {
              setRisk(backendRisk);
            }
          } catch (requestError) {
            if (cancelled) return;

            const message =
              requestError?.message ||
              'The screening request failed.';

            setStatus('failed');
            setError(message);

            setEvents((current) => [
              ...current,
              createEvent(
                'Screening request failed',
                'danger',
                message,
              ),
            ]);

            if (
              socket &&
              socket.readyState === WebSocket.OPEN
            ) {
              socket.close();
            }
          }
        };

        /*
         * ---------------------------------------------------------
         * WEBSOCKET PROGRESS
         * ---------------------------------------------------------
         */

        socket.onmessage = (messageEvent) => {
          if (cancelled) return;

          try {
            const payload = JSON.parse(
              messageEvent.data,
            );

            if (
              payload.type !==
              'screening_progress'
            ) {
              return;
            }

            const stageId = payload.stage;

            const stageIndex =
              getStageIndex(stageId);

            const stage =
              stageIndex >= 0
                ? screeningSteps[stageIndex]
                : null;

            const backendStatus = String(
              payload.status || '',
            ).toUpperCase();

            const backendProgress = Number(
              payload.progress,
            );

            /*
             * Progress percentage
             */
            if (
              Number.isFinite(
                backendProgress,
              )
            ) {
              setProgress(
                Math.max(
                  0,
                  Math.min(
                    100,
                    backendProgress,
                  ),
                ),
              );
            }

            /*
             * Current stage
             */
            if (stage) {
              setCurrentStage(stage);
            }

            /*
             * -----------------------------------------------------
             * STARTED
             * -----------------------------------------------------
             */

            if (
              backendStatus === 'STARTED'
            ) {
              setStatus('running');

              setSteps((current) =>
                current.map((step) => {
                  if (
                    step.id === stageId
                  ) {
                    return {
                      ...step,
                      status: 'active',
                    };
                  }

                  return step;
                }),
              );

              setEvents((current) => [
                ...current,
                createEvent(
                  `${
                    stage?.label ||
                    stageId
                  } started`,
                  'info',
                  payload.message ||
                    'Analysis started.',
                ),
              ]);

              return;
            }

            /*
             * -----------------------------------------------------
             * COMPLETED
             * -----------------------------------------------------
             */

            if (
              backendStatus === 'COMPLETED'
            ) {
              setSteps((current) =>
                current.map((step) => {
                  if (
                    step.id === stageId
                  ) {
                    return {
                      ...step,
                      status: 'completed',
                      description:
                        payload.message ||
                        step.description ||
                        '',
                    };
                  }

                  /*
                   * Make next stage active
                   */
                  if (
                    stageIndex >= 0 &&
                    getStageIndex(
                      step.id,
                    ) ===
                      stageIndex + 1
                  ) {
                    return {
                      ...step,
                      status: 'active',
                    };
                  }

                  return step;
                }),
              );

              setEvents((current) => [
                ...current,
                createEvent(
                  `${
                    stage?.label ||
                    stageId
                  } completed`,
                  'success',
                  payload.message ||
                    'Analysis completed.',
                ),
              ]);

              /*
               * Final stage
               */
              if (
                stageId ===
                'risk-assessment'
              ) {
                setStatus('completed');

                setProgress(100);

                setEvents((current) => [
                  ...current,
                  createEvent(
                    'Automated screening complete',
                    'success',
                    verificationFile
                      ? 'Document and identity screening completed, including face verification.'
                      : 'All available screening stages have completed.',
                  ),
                ]);
              }

              return;
            }

            /*
             * -----------------------------------------------------
             * FAILED
             * -----------------------------------------------------
             */

            if (
              backendStatus === 'FAILED'
            ) {
              const message =
                payload.message ||
                'The screening stage failed.';

              setStatus('failed');
              setError(message);

              setSteps((current) =>
                current.map((step) =>
                  step.id === stageId
                    ? {
                        ...step,
                        status: 'failed',
                        description: message,
                      }
                    : step,
                ),
              );

              setEvents((current) => [
                ...current,
                createEvent(
                  `${
                    stage?.label ||
                    stageId
                  } failed`,
                  'danger',
                  message,
                ),
              ]);
            }
          } catch {
            /*
             * Ignore malformed WebSocket
             * messages.
             */
          }
        };

        /*
         * ---------------------------------------------------------
         * SOCKET ERROR
         * ---------------------------------------------------------
         */

        socket.onerror = () => {
          if (cancelled) return;

          setEvents((current) => [
            ...current,
            createEvent(
              'Live progress connection warning',
              'warning',
              'The live progress channel reported a connection problem.',
            ),
          ]);
        };

        /*
         * ---------------------------------------------------------
         * SOCKET CLOSE
         * ---------------------------------------------------------
         */

        socket.onclose = () => {
          if (cancelled) return;

          /*
           * Do not mark screening failed simply because
           * the WebSocket closes after the HTTP result exists.
           */
          setStatus((current) => {
            if (
              current === 'completed' ||
              current === 'failed'
            ) {
              return current;
            }

            return current;
          });
        };
      } catch (setupError) {
        if (cancelled) return;

        const message =
          setupError?.message ||
          'Unable to start screening.';

        setStatus('failed');
        setError(message);

        setEvents((current) => [
          ...current,
          createEvent(
            'Unable to start screening',
            'danger',
            message,
          ),
        ]);
      }
    }

    beginScreening();

    /*
     * -----------------------------------------------------------
     * CLEANUP
     *
     * React StrictMode may run this once during development.
     * We cancel this particular effect instance and close only
     * its socket.
     * -----------------------------------------------------------
     */

    return () => {
      cancelled = true;

      if (socket) {
        try {
          socket.close();
        } catch {
          // Ignore cleanup errors.
        }
      }
    };
  }, [documentFile, verificationFile]);

  const currentStep =
    currentStage ||
    steps.find(
      (step) =>
        step.status === 'active',
    ) ||
    null;

  const processedCount = steps.filter(
    (step) =>
      step.status === 'completed' ||
      step.status === 'warning',
  ).length;

  return {
    status,

    screeningId,

    screening_id: screeningId,

    progress,

    currentStage,

    currentStep,

    steps,

    events,

    result,

    error,

    risk,

    processedCount,

    warnings: [],

    failure: error
      ? {
          message: error,
        }
      : null,
  };
}