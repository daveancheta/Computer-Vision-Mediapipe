import Link from "next/link";
import { ArrowUpRight, Hand, ScanFace } from "lucide-react";

const visionTools = [
  {
    title: "Face detection",
    description: "Detect faces in real time with the MediaPipe Face Detector.",
    href: "/face-detection",
    icon: ScanFace,
    accent: "text-sky-300",
    border: "hover:border-sky-300/40",
  },
  {
    title: "Hand landmarks",
    description: "Track hand poses and landmarks live from your camera.",
    href: "/hand-land-marker",
    icon: Hand,
    accent: "text-emerald-300",
    border: "hover:border-emerald-300/40",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090a0c] text-[#f2f3f4]">
      <header className="border-b border-white/[0.08]">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5"
        >
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Vision Lab
          </Link>
          <div className="flex items-center gap-5 text-sm text-[#a6abb0]">
            {visionTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="transition hover:text-white"
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
          Computer vision demos
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Explore vision, in real time.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[#a6abb0]">
          Choose a MediaPipe demo to get started. Allow camera access when
          prompted to try live detection.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {visionTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group rounded-2xl border border-white/[0.09] bg-[#0e1012] p-6 transition hover:-translate-y-0.5 hover:bg-[#121517] ${tool.border}`}
              >
                <div className="flex items-start justify-between">
                  <Icon className={`size-6 ${tool.accent}`} aria-hidden="true" />
                  <ArrowUpRight
                    className="size-5 text-[#737a80] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-8 text-xl font-medium">{tool.title}</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#92969b]">
                  {tool.description}
                </p>
                <span className={`mt-6 inline-block text-sm font-medium ${tool.accent}`}>
                  Open demo
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
