import HandLandmark from "@/components/HandLandmark";

export default function Home() {
  return (
    <HandLandmark
      position="top-right"
      SkeletonColor="#55e6c1"
      DotColor="#f8fafc"
      size={4}
    />
  );
}
