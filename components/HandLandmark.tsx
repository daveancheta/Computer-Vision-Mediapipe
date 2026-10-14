"use client";

import { useEffect, useRef, useState } from "react";
import {
    DrawingUtils,
    FilesetResolver,
    HandLandmarker,
} from "@mediapipe/tasks-vision";

type CameraPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface HandLandmarkProps {
    position?: CameraPosition;
    SkeletonColor: string;
    DotColor: string;
    size: number;
}

function HandLandmark({ position = "bottom-right", SkeletonColor, DotColor, size
}: HandLandmarkProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handLandmarkerRef = useRef<HandLandmarker | undefined>(undefined);
    const runningModeRef = useRef<"IMAGE" | "VIDEO">("IMAGE");
    const webcamRunningRef = useRef(false);
    const lastVideoTimeRef = useRef(-1);
    const resultsRef = useRef<ReturnType<
        NonNullable<typeof handLandmarkerRef.current>["detectForVideo"]
    > | undefined>(undefined);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isModelReady, setIsModelReady] = useState(false);
    const [isCameraRunning, setIsCameraRunning] = useState(false);
    const [isCameraStarting, setIsCameraStarting] = useState(false);
    const cameraPositionClasses: Record<CameraPosition, string> = {
        "top-left": "left-4 top-4 sm:left-6 sm:top-6",
        "top-right": "right-4 top-4 sm:right-6 sm:top-6",
        "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
        "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
    };

    useEffect(() => {
        let cancelled = false;

        async function createHandLandmarker() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm",
                );
                const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "GPU",
                    },
                    runningMode: runningModeRef.current,
                    numHands: 2,
                });

                if (cancelled) {
                    handLandmarker.close();
                    return;
                }

                handLandmarkerRef.current = handLandmarker;
                setIsModelReady(true);
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load the hand tracking model:", error);
                }
            }
        }

        void createHandLandmarker();

        return () => {
            cancelled = true;
            webcamRunningRef.current = false;
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
            streamRef.current?.getTracks().forEach((track) => track.stop());
            handLandmarkerRef.current?.close();
        };
    }, []);

    async function toggleCamera() {
        if (webcamRunningRef.current) {
            webcamRunningRef.current = false;
            setIsCameraRunning(false);
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            const canvas = canvasRef.current;
            const context = canvas?.getContext("2d");
            if (canvas && context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        setIsCameraStarting(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            const video = videoRef.current;
            if (!video) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }

            streamRef.current = stream;
            video.srcObject = stream;
            await video.play();

            webcamRunningRef.current = true;
            setIsCameraRunning(true);
            animationFrameRef.current = window.requestAnimationFrame((timestamp) => {
                void predictWebcam(timestamp);
            });
        } catch (error) {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            console.error("Failed to start the camera:", error);
        } finally {
            setIsCameraStarting(false);
        }
    }

    async function predictWebcam(timestamp: number) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const handLandmarker = handLandmarkerRef.current;
        if (!video || !canvas || !handLandmarker || !webcamRunningRef.current) {
            if (video && canvas && webcamRunningRef.current) {
                animationFrameRef.current = window.requestAnimationFrame((frameTime) => {
                    void predictWebcam(frameTime);
                });
            }
            return;
        }

        if (runningModeRef.current === "IMAGE") {
            await handLandmarker.setOptions({ runningMode: "VIDEO" });
            runningModeRef.current = "VIDEO";
        }

        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) return;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        if (lastVideoTimeRef.current !== video.currentTime) {
            lastVideoTimeRef.current = video.currentTime;
            resultsRef.current = handLandmarker.detectForVideo(video, timestamp);
        }

        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        if (resultsRef.current?.landmarks) {
            const drawingUtils = new DrawingUtils(canvasContext);
            for (const landmarks of resultsRef.current.landmarks) {
                drawingUtils.drawConnectors(
                    landmarks,
                    HandLandmarker.HAND_CONNECTIONS,
                    { color: SkeletonColor, lineWidth: size },
                );
                drawingUtils.drawLandmarks(landmarks, {
                    color: DotColor,
                    fillColor: DotColor,
                    lineWidth: 1,
                    radius: size,
                });
            }
        }

        if (webcamRunningRef.current) {
            animationFrameRef.current = window.requestAnimationFrame((frameTime) => {
                void predictWebcam(frameTime);
            });
        }
    }

    return (
        <main
            className="relative min-h-screen w-full overflow-hidden bg-black"
        >
            <div
                className={`absolute z-10 aspect-video w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl shadow-black/50 sm:w-[min(28rem,calc(100vw-3rem))] ${cameraPositionClasses[position]}`}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    aria-label="Camera preview"
                    className={`absolute inset-0 size-full object-cover ${isCameraRunning ? "scale-x-[-1]" : "hidden"
                        }`}
                />
                <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    className={`absolute inset-0 size-full object-cover ${isCameraRunning ? "scale-x-[-1]" : "hidden"
                        }`}
                />
            </div>
            <button
                type="button"
                onClick={toggleCamera}
                disabled={isCameraStarting}
                className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-wait disabled:opacity-60"
            >
                {isCameraRunning
                    ? "Disable camera"
                    : isCameraStarting
                        ? "Starting camera..."
                        : isModelReady
                            ? "Enable camera"
                            : "Enable camera (tracking loading)"}
            </button>
        </main>
    );
}

export default HandLandmark;
