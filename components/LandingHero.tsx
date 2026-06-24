import Image from "next/image";

import { HERO_POSTERS } from "@/lib/constants";

type LandingHeroProps = {
  onStart: () => void;
};

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/80 px-6 py-10 shadow-glow backdrop-blur sm:px-10 sm:py-14">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute -right-16 top-12 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-highlight/10 blur-3xl" />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
            Discover your movie taste, one choice at a time.
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Find your next favorite movie.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Movieinder learns your taste through simple head-to-head picks and adapts recommendations in real time,
            so every swipe-like choice gets smarter.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100"
              onClick={onStart}
            >
              Start Matching
            </button>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
              No sign-up. No friction. Just taste discovery.
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Smarter recommendations", "Genre weighting evolves with every choice."],
              ["Your Movie DNA", "A living taste profile you can actually understand."],
              ["Instant discovery", "Fresh TMDB picks without waiting on a backend."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
          {HERO_POSTERS.map((poster, index) => (
            <div
              key={poster}
              className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 ${
                index === 1 ? "translate-y-8 animate-float" : ""
              }`}
            >
              <Image
                src={poster}
                alt="Stylized movie poster preview"
                width={720}
                height={1080}
                className="h-full w-full object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
