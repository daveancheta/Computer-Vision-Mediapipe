import Link from "next/link";
import { ArrowUpRight, Hand, LockKeyhole, ScanFace } from "lucide-react";
import { connection } from "next/server";
import registry from "../registry.json";

export const instant = false;

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

export default async function Home() {
  await connection();

  const isRestricted = process.env.NEXT_PUBLIC_ACCESS === "RESTRICT";

  if (isRestricted) {
    return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090a0c] px-6 py-16 text-[#f2f3f4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/[0.07] blur-[120px]"
      />

      <section className="relative w-full max-w-lg rounded-3xl border border-white/[0.09] bg-[#0e1012]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide">Vision Lab</span>
          <span className="rounded-full border border-rose-300/20 bg-rose-300/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-rose-200">
            Restricted
          </span>
        </div>

        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-rose-300/15 bg-rose-300/[0.08]">
          <LockKeyhole className="size-6 text-rose-200" aria-hidden="true" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#92969b]">
          Access unavailable
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          You don&apos;t have access here.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#a6abb0]">
          This vision lab is currently restricted. If you think you should be
          able to access it, please contact the site owner.
        </p>

        <a
          href={registry.homepage}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#f2f3f4] px-5 text-sm font-semibold text-[#101214] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1012]"
        >
          Visit the project repository
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>

        <p className="mt-6 border-t border-white/[0.08] pt-5 text-xs leading-5 text-[#737a80]">
          If you believe this is a mistake, ask the project owner to review your
          access.
        </p>
      </section>
    </main>
    );
  }

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
