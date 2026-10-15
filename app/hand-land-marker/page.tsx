import HandLandMark from "@/components/hand-land-mark/HandLandMark";

export default function Home() {
  return (
    <HandLandMark
      position="top-right"
      SkeletonColor="#55e6c1"
      DotColor="#f8fafc"
      size={4}
    />
  );
}
