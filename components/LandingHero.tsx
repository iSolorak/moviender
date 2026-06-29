import Image from "next/image";

import { HERO_BACKGROUND } from "@/lib/constants";

type LandingHeroProps = {
  onStart: () => void;
};

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 sm:px-10">
      <Image
        src={HERO_BACKGROUND}
        alt="Abstract cinematic background"
        fill
        priority
        sizes="100vw"
        className="hero-background object-cover object-center"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(8,11,18,0.12),_rgba(4,6,10,0.88)_72%),linear-gradient(180deg,rgba(2,4,9,0.35),rgba(2,4,9,0.74))]" />
      <div className="hero-vignette-overlay absolute inset-0" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="hero-texture-overlay absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
        <p className="max-w-xl text-[0.7rem] font-medium uppercase tracking-[0.5em] text-white/72 sm:text-[0.78rem]">
          Discover your movie taste, one choice at a time.
        </p>

        <h1 className="font-title mt-5 text-[clamp(5rem,18vw,12rem)] uppercase leading-[0.88] tracking-[0.16em] text-white [text-wrap:balance] sm:mt-7">
          Movieinder
        </h1>

        <button
          className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/40 bg-white/8 px-7 py-4 text-sm font-semibold uppercase tracking-[0.32em] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition duration-300 hover:border-white/60 hover:bg-white/14 hover:shadow-[0_0_20px_rgba(255,255,255,0.08),0_16px_50px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={onStart}
        >
          <span>Begin Matching</span>
          <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
