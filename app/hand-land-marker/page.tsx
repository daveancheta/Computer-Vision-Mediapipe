import HandLandMark from "@/components/HandLandMarker";

export default function Home() {
  return (
    <HandLandMark
      position="top-right"
      skeletonColor="#55e6c1"
      dotColor="#f8fafc"
      size={4}
    />
  );
}
