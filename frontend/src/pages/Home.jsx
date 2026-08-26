import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  ChartNoAxesCombined,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
  Zap,
  Trophy,
} from "lucide-react";


import heroImage from "../assets/home/hero.png";
import formAnalysisImage from "../assets/home/form-analysis.png";
import workoutPreviewImage from "../assets/home/workout-preview.png";
import nutritionImage from "../assets/home/nutrition.png";
import progressTracking from "../assets/home/progress-tracking.png";

import avatar1 from "../assets/home/avatar-1.png";
import avatar2 from "../assets/home/avatar-2.png";
import avatar3 from "../assets/home/avatar-3.png";
import avatar4 from "../assets/home/avatar-4.png";

const features = [
  {
    number: "01",
    title: "AI Form Analysis",
    description:
      "Real-time posture detection and movement analysis to help you train with perfect form.",
    icon: Brain,
    image:formAnalysisImage,
  },
  {
    number: "02",
    title: "Personalized Workouts",
    description:
      "AI creates customized workout plans tailored to your goals, experience and equipment.",
    icon: Dumbbell,
    image:workoutPreviewImage,
  },
  {
    number: "03",
    title: "Progress Tracking",
    description:
      "Track your strength, endurance and consistency with beautiful insights and analytics.",
    icon: ChartNoAxesCombined,
    image:progressTracking,
  },
  {
    number: "04",
    title: "Smart Nutrition",
    description:
      "AI-powered meal plans and nutrition insights built around your body and training goals.",
    icon: Utensils,
    image:nutritionImage,
  },
];


const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
];

function ScrollProgressLine({ sectionRef }) {
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationFrame = useRef(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const start = viewportHeight * 0.35;
      const end = viewportHeight * 0.65;

      const distance = rect.height - (end - start);
      const current = start - rect.top;

      let value = current / distance;

      value = Math.max(0, Math.min(1, value));

      targetProgress.current = value;
    };

    const animate = () => {
      const current = currentProgress.current;
      const target = targetProgress.current;

      // Smooth interpolation
      const next = current + (target - current) * 0.08;

      currentProgress.current = next;

      setProgress(next);

      animationFrame.current =
        requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    animationFrame.current =
      requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [sectionRef]);

  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:block">
      
      {/* Main path */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-lime-400/25" />

      {/* Path glow */}
      <div className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2 bg-lime-400/[0.02] blur-xl" />

      {/* Moving glow */}
      <div
        className="absolute left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime-200 bg-lime-400 shadow-[0_0_12px_#a3e635,0_0_30px_rgba(163,230,53,0.8)]"
        style={{
          top: `${progress * 100}%`,
        }}
      />

      {/* Outer glow */}
      <div
        className="absolute left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-xl"
        style={{
          top: `${progress * 100}%`,
        }}
      />
    </div>
  );
}

function Home() {
  const featureSectionRef = useRef(null);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050606] text-white">
      {/* ================= NAVBAR ================= */}

      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/5 bg-[#050606]/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo */}

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-lime-400/50 bg-lime-400/10">
              <Dumbbell size={19} className="text-lime-400" />
            </div>

            <span className="text-xl font-black tracking-[0.18em]">
              TITAN<span className="text-lime-400">LIFT</span>
            </span>
          </a>

          {/* Navigation */}

          <div className="hidden items-center gap-9 text-sm text-white/60 md:flex">
            <a
              href="#home"
              className="transition hover:text-lime-400"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-lime-400"
            >
              Features
            </a>

            <a
              href="#why-us"
              className="transition hover:text-lime-400"
            >
              Why Us
            </a>

            <a
              href="#pricing"
              className="transition hover:text-lime-400"
            >
              Pricing
            </a>

            <a
              href="#about"
              className="transition hover:text-lime-400"
            >
              About Us
            </a>
          </div>

          <a
            href="/dashboard"
            className="rounded-full border border-lime-400 px-5 py-2.5 text-sm font-semibold text-lime-300 transition hover:bg-lime-400 hover:text-black"
          >
            Get Started
          </a>
        </nav>
      </header>

      <main id="home">
        {/* ================= HERO ================= */}

        <section className="relative min-h-screen overflow-hidden pt-20">
          {/* Background */}

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage: `url(${heroImage})`,
            }}
          />

          {/* Overlays */}

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#050606]/90 via-[#050606]/45 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050606]/80 via-transparent to-transparent" />

          {/* Lime ambient glow */}

          <div className="absolute left-[15%] top-[35%] h-80 w-80 rounded-full bg-lime-400/10 blur-[140px]" />

          {/* Hero content */}

          <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-24 lg:px-10">
            <div className="max-w-3xl">
              {/* Badge */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-black/40 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur">
                <Sparkles
                  size={13}
                  className="text-lime-400"
                />

                AI-POWERED FITNESS PLATFORM
              </div>

              {/* Heading */}

              <h1 className="text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
                TRAIN HARD.
                <br />

                <span className="text-lime-400">
                  ANALYZE SMART.
                </span>
              </h1>

              {/* Description */}

              <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                TitanLift uses advanced AI to analyze your form,
                create personalized workouts and track your progress
                like never before.
              </p>

              {/* Buttons */}

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="/dashboard"
                  className="group flex items-center gap-3 rounded-full bg-lime-400 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300"
                >
                  Start Free Trial

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#features"
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur transition hover:border-lime-400/30 hover:text-lime-400"
                >
                  Explore Features
                </a>
              </div>

              {/* Social proof */}

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-9 w-9 rounded-full border-2 border-[#090a0a] bg-gradient-to-br from-zinc-400 to-zinc-700"
                    />
                  ))}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Join 10K+
                  </p>

                  <p className="text-xs text-white/45">
                    fitness enthusiasts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
            <span className="text-[9px] tracking-[0.25em] text-white/40">
              SCROLL TO EXPLORE
            </span>

            <div className="h-10 w-px bg-gradient-to-b from-lime-400 to-transparent" />
          </div>
        </section>

        {/* ================= FEATURE JOURNEY ================= */}

        <section
          ref={featureSectionRef}
          id="features"
          className="relative bg-[#050606] px-6 py-28 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}

            <div className="mb-20 text-center">
              <p className="text-xs font-bold tracking-[0.3em] text-lime-400">
                THE TITANLIFT SYSTEM
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Everything you need
                <br />

                <span className="text-white/40">
                  to get stronger.
                </span>
              </h2>
            </div>

            {/* Feature area */}

            <div className="relative">
              {/* SINGLE MOVING CIRCLE */}

              <ScrollProgressLine
                sectionRef={featureSectionRef}
              />

              <div className="space-y-12 lg:space-y-24">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  const isRight = index % 2 === 1;

                  return (
                    <div
                      key={feature.number}
                      className="relative grid items-center gap-10 lg:grid-cols-2"
                    >
                      {/* Feature card */}

                      <div
                        className={
                          isRight
                            ? "lg:order-2"
                            : "lg:order-1"
                        }
                      >
                        <div className="rounded-3xl border border-white/[0.07] bg-[#0b0d0d] p-7 transition hover:border-lime-400/20">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-lime-400/15 bg-lime-400/10">
                              <Icon
                                size={23}
                                className="text-lime-400"
                              />
                            </div>

                            <span className="text-3xl font-black text-lime-400/30">
                              {feature.number}
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold">
                            {feature.title}
                          </h3>

                          <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
                            {feature.description}
                          </p>

                          <button className="mt-6 flex items-center gap-2 text-xs font-bold text-lime-400 transition hover:text-lime-300">
                            Learn more

                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Feature image */}

                      <div
                        className={
                          isRight
                            ? "lg:order-1"
                            : "lg:order-2"
                        }
                      >
                        <div className="group relative h-64 overflow-hidden rounded-3xl border border-white/[0.07]">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_12px_#a3e635]" />

                            TitanLift AI
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="px-6 py-16 lg:px-10">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-35"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80')",
              }}
            />

            <div className="absolute inset-0 bg-black/70" />

            <div className="relative px-6 py-20 text-center">
              <h2 className="text-4xl font-black sm:text-5xl">
                Ready to transform
                <br />

                your{" "}
                <span className="text-lime-400">
                  fitness?
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm text-white/50">
                Join TitanLift and unlock your true potential
                with AI-powered training.
              </p>

              <a
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-lime-400 px-7 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300"
              >
                Start Your Journey

                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* ================= WHY TITANLIFT ================= */}

        <section
          id="why-us"
          className="px-6 py-28 lg:px-10"
        >
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-lime-400">
              WHY CHOOSE TITANLIFT
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Smarter Technology.
              <br />
              Stronger You.
            </h2>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered",
                  text: "Advanced AI models for accurate analysis and recommendations.",
                },
                {
                  icon: ShieldCheck,
                  title: "Privacy First",
                  text: "Your data is secure and never shared with third parties.",
                },
                {
                  icon: Zap,
                  title: "Adaptive",
                  text: "Plans evolve with your progress and performance.",
                },
                {
                  icon: Trophy,
                  title: "Backed by Science",
                  text: "Evidence-based approaches for sustainable results.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/[0.06] bg-[#090b0b] p-7 transition hover:-translate-y-1 hover:border-lime-400/20"
                  >
                    <Icon
                      size={30}
                      strokeWidth={1.7}
                      className="mx-auto text-lime-400"
                    />

                    <h3 className="mt-5 font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-xs leading-5 text-white/40">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer
          id="about"
          className="border-t border-white/[0.06] bg-[#030404] px-6 py-14 lg:px-10"
        >
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
            {/* Brand */}

            <div>
              <div className="flex items-center gap-3">
                <Dumbbell
                  className="text-lime-400"
                  size={21}
                />

                <span className="font-black tracking-[0.15em]">
                  TITAN
                  <span className="text-lime-400">
                    LIFT
                  </span>
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/35">
                TitanLift is your AI-powered fitness companion,
                helping you train harder, smarter and achieve
                your goals.
              </p>

              <div className="mt-5 flex items-center gap-3 text-white/35">
                <Users size={17} />

                <span className="text-xs">
                  Built for serious athletes.
                </span>
              </div>
            </div>

            {/* Product */}

            <div>
              <h4 className="text-xs font-bold tracking-wider text-white/70">
                PRODUCT
              </h4>

              <div className="mt-5 space-y-3 text-sm text-white/35">
                <a className="block transition hover:text-lime-400">
                  Features
                </a>

                <a className="block transition hover:text-lime-400">
                  Pricing
                </a>

                <a className="block transition hover:text-lime-400">
                  Updates
                </a>

                <a className="block transition hover:text-lime-400">
                  Roadmap
                </a>
              </div>
            </div>

            {/* Company */}

            <div>
              <h4 className="text-xs font-bold tracking-wider text-white/70">
                COMPANY
              </h4>

              <div className="mt-5 space-y-3 text-sm text-white/35">
                <a className="block transition hover:text-lime-400">
                  About Us
                </a>

                <a className="block transition hover:text-lime-400">
                  Blog
                </a>

                <a className="block transition hover:text-lime-400">
                  Careers
                </a>

                <a className="block transition hover:text-lime-400">
                  Contact
                </a>
              </div>
            </div>

            {/* Newsletter */}

            <div>
              <h4 className="text-xs font-bold tracking-wider text-white/70">
                STAY UPDATED
              </h4>

              <p className="mt-5 text-sm text-white/35">
                Get the latest training insights and updates.
              </p>

              <div className="mt-4 flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xs outline-none placeholder:text-white/25"
                />

                <button className="m-1 flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400 text-black transition hover:bg-lime-300">
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}

          <div className="mx-auto mt-14 max-w-6xl border-t border-white/[0.05] pt-6 text-center text-[11px] text-white/25">
            © 2026 TitanLift. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;