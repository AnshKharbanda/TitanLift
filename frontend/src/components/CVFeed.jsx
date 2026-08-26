import { useEffect, useRef, useState } from "react";

import {
  Activity,
  Camera,
  CheckCircle2,
  CircleStop,
  Loader2,
  Play,
  ShieldCheck,
  Video,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";

import {
  createCVSocket,
  startCVSession,
  sendCVFrame,
  stopCVSession,
  closeCVSocket,
} from "../services/cv";


const EXERCISES = [
  {
    value: "SQUAT",
    label: "Squat",
    description: "Lower body",
  },
  {
    value: "PUSHUP",
    label: "Push-Up",
    description: "Upper body",
  },
];


const SIDES = [
  {
    value: "LEFT",
    label: "Left",
  },
  {
    value: "RIGHT",
    label: "Right",
  },
];


const INITIAL_METRICS = {
  person_detected: false,
  exercise: "SQUAT",
  side: "RIGHT",

  total_reps: 0,
  good_reps: 0,

  depth_errors: 0,
  hip_drive_errors: 0,
  hip_sag_errors: 0,

  knee_angle: null,
  hip_angle: null,

  elbow_angle: null,
  body_angle: null,

  live_feedback: [],
};


function CVFeed() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const captureTimerRef = useRef(null);

  const sessionStoppingRef =
    useRef(false);


  const [selectedExercise, setSelectedExercise] =
    useState("SQUAT");

  const [selectedSide, setSelectedSide] =
    useState("RIGHT");


  const [cameraActive, setCameraActive] =
    useState(false);

  const [sessionActive, setSessionActive] =
    useState(false);

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [stopping, setStopping] =
    useState(false);

  const [error, setError] =
    useState("");

  const [savedMessage, setSavedMessage] =
    useState("");

  const [metrics, setMetrics] =
    useState(INITIAL_METRICS);


  /* =========================================================
     CAMERA
  ========================================================= */

  async function startCamera() {
    try {
      setCameraLoading(true);
      setError("");
      setSavedMessage("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Webcam access is not supported by this browser."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 640,
            },
            height: {
              ideal: 480,
            },
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      setCameraActive(true);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Could not access your webcam."
      );

      throw err;

    } finally {
      setCameraLoading(false);
    }
  }


  function stopCamera() {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }

    setCameraActive(false);
  }


  /* =========================================================
     SOCKET
  ========================================================= */

  function connectSocket() {
    return new Promise(
      (resolve, reject) => {
        let settled = false;

        const socket =
          createCVSocket();

        socketRef.current = socket;


        socket.onopen = () => {
          setSocketConnected(true);

          if (!settled) {
            settled = true;
            resolve(socket);
          }
        };


        socket.onmessage = (event) => {
          try {
            const data =
              JSON.parse(event.data);


            if (
              data.type === "started"
            ) {
              setSessionActive(true);
              setStopping(false);
            }


            if (
              data.type === "metrics"
            ) {
              setMetrics((previous) => ({
                ...previous,
                ...data,
              }));
            }


            if (
              data.type === "saved"
            ) {
              setSavedMessage(
                `Session saved successfully · ${data.total_reps} reps`
              );

              setStopping(false);
            }


            if (
              data.type === "stopped"
            ) {
              stopFrameCapture();

              setSessionActive(false);
              setStopping(false);

              if (
                socketRef.current
              ) {
                closeCVSocket(
                  socketRef.current
                );

                socketRef.current =
                  null;
              }

              setSocketConnected(false);
            }


            if (
              data.type === "error"
            ) {
              setError(
                data.message ||
                  "CV analysis failed."
              );

              setStopping(false);
            }

          } catch (err) {
            console.error(
              "Invalid CV response:",
              err
            );
          }
        };


        socket.onerror = () => {
          setSocketConnected(false);

          if (!settled) {
            settled = true;

            reject(
              new Error(
                "Could not connect to the CV server."
              )
            );
          }
        };


        socket.onclose = () => {
          setSocketConnected(false);

          if (!sessionStoppingRef.current) {
            setSessionActive(false);
          }

          if (!settled) {
            settled = true;

            reject(
              new Error(
                "CV WebSocket closed before connecting."
              )
            );
          }
        };
      }
    );
  }


  async function ensureSocket() {
    if (
      socketRef.current &&
      socketRef.current.readyState ===
        WebSocket.OPEN
    ) {
      return socketRef.current;
    }

    return connectSocket();
  }


  /* =========================================================
     FRAME CAPTURE
  ========================================================= */

  function startFrameCapture(socket) {
    stopFrameCapture();

    const canvas =
      canvasRef.current;

    const video =
      videoRef.current;

    if (!canvas || !video) {
      return;
    }

    const context =
      canvas.getContext("2d");

    captureTimerRef.current =
      setInterval(() => {
        if (
          video.readyState < 2 ||
          !video.videoWidth ||
          !video.videoHeight
        ) {
          return;
        }

        if (
          socket.readyState !==
          WebSocket.OPEN
        ) {
          return;
        }

        canvas.width =
          video.videoWidth;

        canvas.height =
          video.videoHeight;

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const frame =
          canvas.toDataURL(
            "image/jpeg",
            0.55
          );

        sendCVFrame(
          socket,
          frame
        );
      }, 120);
  }


  function stopFrameCapture() {
    if (captureTimerRef.current) {
      clearInterval(
        captureTimerRef.current
      );

      captureTimerRef.current =
        null;
    }
  }


  /* =========================================================
     SESSION START
  ========================================================= */

  async function startSession() {
    try {
      setError("");
      setSavedMessage("");

      sessionStoppingRef.current =
        false;

      if (!cameraActive) {
        await startCamera();
      }

      const socket =
        await ensureSocket();


      setMetrics({
        ...INITIAL_METRICS,
        exercise: selectedExercise,
        side: selectedSide,
      });


      startCVSession(
        socket,
        selectedExercise,
        selectedSide
      );


      startFrameCapture(socket);

    } catch (err) {
      console.error(err);

      stopFrameCapture();
      stopCamera();

      if (
        socketRef.current
      ) {
        closeCVSocket(
          socketRef.current
        );

        socketRef.current =
          null;
      }

      setSocketConnected(false);
      setSessionActive(false);

      setError(
        err.message ||
          "Could not start CV session."
      );
    }
  }


  /* =========================================================
     SESSION STOP
  ========================================================= */

  function endSession() {
    if (
      stopping ||
      !socketRef.current
    ) {
      return;
    }

    sessionStoppingRef.current =
      true;

    setStopping(true);
    setError("");

    stopFrameCapture();

    const sent =
      stopCVSession(
        socketRef.current
      );

    if (!sent) {
      setStopping(false);
      setSessionActive(false);

      closeCVSocket(
        socketRef.current
      );

      socketRef.current = null;

      setSocketConnected(false);

      return;
    }


    /*
      IMPORTANT:
      Do not close the WebSocket here.

      The backend first saves CVAnalysis,
      then sends:
        { type: "saved" }
      and finally:
        { type: "stopped" }

      The onmessage handler closes it after
      receiving "stopped".
    */
  }


  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      stopFrameCapture();

      if (
        socketRef.current
      ) {
        try {
          stopCVSession(
            socketRef.current
          );
        } catch {
          // Cleanup only.
        }

        closeCVSocket(
          socketRef.current
        );

        socketRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        streamRef.current =
          null;
      }
    };
  }, []);


  /* =========================================================
     DERIVED VALUES
  ========================================================= */

  const isSquat =
    selectedExercise === "SQUAT";


  const primaryAngle =
    isSquat
      ? metrics.knee_angle
      : metrics.elbow_angle;


  const secondaryAngle =
    isSquat
      ? metrics.hip_angle
      : metrics.body_angle;


  const primaryAngleLabel =
    isSquat
      ? "KNEE ANGLE"
      : "ELBOW ANGLE";


  const secondaryAngleLabel =
    isSquat
      ? "HIP ANGLE"
      : "BODY ANGLE";


  const secondaryErrorLabel =
    isSquat
      ? "HIP DRIVE"
      : "HIP SAG";


  const secondaryErrorCount =
    isSquat
      ? metrics.hip_drive_errors
      : metrics.hip_sag_errors;


  return (
    <div className="space-y-6">

      {/* =====================================================
          TOP STATUS
      ===================================================== */}

      <section className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5 sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
              COMPUTER VISION ENGINE
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Live Form Analysis
            </h2>

            <p className="mt-2 text-sm text-white/30">
              Real-time movement analysis and
              form feedback.
            </p>

          </div>


          <div className="flex flex-wrap items-center gap-2">

            <StatusPill
              active={socketConnected}
              activeText="CV Connected"
              inactiveText="CV Offline"
              activeIcon={Wifi}
              inactiveIcon={WifiOff}
            />

            <StatusPill
              active={cameraActive}
              activeText="Camera Ready"
              inactiveText="Camera Off"
              activeIcon={Camera}
              inactiveIcon={Camera}
            />

          </div>

        </div>


        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}


        {savedMessage && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-lime-400/15 bg-lime-400/[0.04] p-4 text-sm text-lime-400">
            <CheckCircle2 size={17} />
            {savedMessage}
          </div>
        )}

      </section>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">

        {/* ===================================================
            CAMERA
        =================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b0d0d]">

          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

            <div className="flex items-center gap-2">

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  sessionActive
                    ? "animate-pulse bg-red-400"
                    : "bg-white/20"
                }`}
              />

              <p className="text-xs font-bold tracking-[0.18em]">
                LIVE FEED
              </p>

            </div>


            <p className="text-xs text-white/25">
              {sessionActive
                ? "Analyzing movement"
                : "Camera ready"}
            </p>

          </div>


          <div className="relative aspect-video bg-[#050606]">

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`h-full w-full object-cover ${
                cameraActive
                  ? "block"
                  : "hidden"
              }`}
            />


            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400/10">
                  <Camera
                    size={28}
                    className="text-lime-400/60"
                  />
                </div>

                <p className="mt-5 text-sm font-semibold text-white/50">
                  Camera is not active
                </p>

                <p className="mt-1 text-xs text-white/25">
                  Start analysis to begin
                </p>

              </div>
            )}


            {cameraActive && (
              <>
                <div className="absolute left-4 top-4 flex gap-2">

                  <OverlayPill
                    label="EXERCISE"
                    value={
                      isSquat
                        ? "SQUAT"
                        : "PUSH-UP"
                    }
                  />

                  <OverlayPill
                    label="SIDE"
                    value={
                      selectedSide
                    }
                  />

                </div>


                <div className="absolute bottom-4 left-4">

                  <div className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur">

                    <p className="text-[9px] font-bold tracking-[0.15em] text-white/30">
                      STATUS
                    </p>

                    <p className="mt-1 text-xs font-semibold text-white/75">
                      {metrics.person_detected
                        ? "Person detected"
                        : "Position yourself in frame"}
                    </p>

                  </div>

                </div>
              </>
            )}

          </div>


          {/* Camera controls */}

          <div className="border-t border-white/[0.06] p-5">

            {!sessionActive ? (

              <button
                type="button"
                onClick={startSession}
                disabled={
                  cameraLoading ||
                  stopping
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {cameraLoading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Play size={17} />
                )}

                Start Analysis

              </button>

            ) : (

              <button
                type="button"
                onClick={endSession}
                disabled={stopping}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {stopping ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <CircleStop size={17} />
                )}

                {stopping
                  ? "Saving Session..."
                  : "End Session"}

              </button>

            )}

          </div>

        </div>


        {/* ===================================================
            RIGHT PANEL
        =================================================== */}

        <div className="space-y-5">

          {/* Live Feedback */}

          <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                  LIVE FEEDBACK
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  Form Coach
                </h3>

              </div>


              {metrics.person_detected && (
                <CheckCircle2
                  size={18}
                  className="text-lime-400"
                />
              )}

            </div>


            <div className="mt-4 space-y-3">

              {metrics.live_feedback.length ===
              0 ? (

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">

                  <p className="text-sm font-semibold text-white/55">
                    {metrics.person_detected
                      ? "Good form"
                      : "Waiting for movement"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/25">
                    {metrics.person_detected
                      ? "No active form warning."
                      : "Stand in front of the camera to begin."}
                  </p>

                </div>

              ) : (

                metrics.live_feedback.map(
                  (feedback) => (
                    <div
                      key={feedback}
                      className="rounded-xl border border-lime-400/10 bg-lime-400/[0.03] p-4"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-400/10">
                          <XCircle
                            size={16}
                            className="text-lime-400"
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white/75">
                            {feedback}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            Correct your movement and continue.
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )

              )}

            </div>

          </div>


          {/* Angles */}

          <div className="grid grid-cols-2 gap-3">

            <AngleCard
              label={primaryAngleLabel}
              value={primaryAngle}
            />

            <AngleCard
              label={secondaryAngleLabel}
              value={secondaryAngle}
            />

          </div>


          {/* Session Stats */}

          <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">

            <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
              SESSION STATS
            </p>


            <div className="mt-4 grid grid-cols-2 gap-3">

              <StatCard
                label="TOTAL REPS"
                value={metrics.total_reps}
              />

              <StatCard
                label="GOOD REPS"
                value={metrics.good_reps}
              />

              <StatCard
                label="DEPTH ERRORS"
                value={metrics.depth_errors}
              />

              <StatCard
                label={secondaryErrorLabel}
                value={secondaryErrorCount}
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SELECTORS
      ===================================================== */}

      <section className="grid gap-5 lg:grid-cols-2">

        <SelectorCard
          eyebrow="EXERCISE"
          title="Select Movement"
        >

          <div className="grid grid-cols-2 gap-3">

            {EXERCISES.map(
              (item) => {

                const active =
                  selectedExercise ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={sessionActive}
                    onClick={() =>
                      setSelectedExercise(
                        item.value
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-lime-400/30 bg-lime-400/10"
                        : "border-white/[0.06] bg-white/[0.015] hover:border-white/10"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >

                    <p
                      className={`text-sm font-bold ${
                        active
                          ? "text-lime-400"
                          : "text-white/60"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      {item.description}
                    </p>

                  </button>
                );
              }
            )}

          </div>

        </SelectorCard>


        <SelectorCard
          eyebrow="CAMERA SIDE"
          title="Detection Side"
        >

          <div className="grid grid-cols-2 gap-3">

            {SIDES.map(
              (item) => {

                const active =
                  selectedSide ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={sessionActive}
                    onClick={() =>
                      setSelectedSide(
                        item.value
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-lime-400/30 bg-lime-400/10"
                        : "border-white/[0.06] bg-white/[0.015] hover:border-white/10"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >

                    <p
                      className={`text-sm font-bold ${
                        active
                          ? "text-lime-400"
                          : "text-white/60"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Side-facing camera
                    </p>

                  </button>
                );
              }
            )}

          </div>

        </SelectorCard>

      </section>


      {/* =====================================================
          INFO
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-3">

        <InfoCard
          icon={Camera}
          title="Position"
          text="Keep your full body visible from the side."
        />

        <InfoCard
          icon={Activity}
          title="Analyze"
          text="TitanLift tracks movement frame by frame."
        />

        <InfoCard
          icon={ShieldCheck}
          title="Improve"
          text="Use the feedback to correct your form."
        />

      </section>


      <canvas
        ref={canvasRef}
        className="hidden"
      />

    </div>
  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatusPill({
  active,
  activeText,
  inactiveText,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
}) {
  const Icon =
    active
      ? ActiveIcon
      : InactiveIcon;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">

      <Icon
        size={14}
        className={
          active
            ? "text-lime-400"
            : "text-white/25"
        }
      />

      <span className="text-xs text-white/40">
        {active
          ? activeText
          : inactiveText}
      </span>

    </div>
  );
}


function OverlayPill({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur">

      <p className="text-[8px] font-bold tracking-[0.15em] text-white/30">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-bold text-white/80">
        {value}
      </p>

    </div>
  );
}


function AngleCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-4">

      <p className="text-[9px] font-bold tracking-[0.15em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-lime-400">
        {value == null
          ? "—"
          : `${Math.round(value)}°`}
      </p>

    </div>
  );
}


function StatCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

      <p className="text-[9px] font-bold tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>

    </div>
  );
}


function SelectorCard({
  eyebrow,
  title,
  children,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5 sm:p-6">

      <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
        {eyebrow}
      </p>

      <h3 className="mt-1 text-lg font-bold">
        {title}
      </h3>

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}


function InfoCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10">
        <Icon
          size={17}
          className="text-lime-400"
        />
      </div>

      <h3 className="mt-4 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/25">
        {text}
      </p>

    </div>
  );
}


export default CVFeed;