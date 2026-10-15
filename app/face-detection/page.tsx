import FaceDetection from "@/components/face-detection/FaceDetection";

export default function Home() {
    return (
        <FaceDetection
            position="top-right"
            boxColor="#7dd3fc"
            labelColor="#0f172a"
            size={4}
        />
    );
}
