import {
  Activity,
  Camera,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

import AppShell from "../components/AppShell";
import CVFeed from "../components/CVFeed";


function AIAnalysis() {
  return (
    <AppShell
      eyebrow="COMPUTER VISION"
      title="AI Analysis"
    >

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            INTRO
        ================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">

                  <ScanLine
                    size={20}
                    className="text-lime-400"
                  />

                </div>


                <div>

                  <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                    AI-POWERED FORM ANALYSIS
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight">
                    Train Smarter
                  </h1>

                </div>

              </div>


              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/35">
                Use your webcam to analyze your
                movement, count repetitions, and
                receive real-time form feedback.
              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <FeatureBadge
                icon={Camera}
                text="Webcam"
              />

              <FeatureBadge
                icon={Activity}
                text="Live Analysis"
              />

              <FeatureBadge
                icon={ShieldCheck}
                text="Form Feedback"
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            CV APPLICATION
        ================================================== */}

        <CVFeed />

      </div>

    </AppShell>
  );
}


function FeatureBadge({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">

      <Icon
        size={14}
        className="text-lime-400"
      />

      <span className="text-xs font-semibold text-white/40">
        {text}
      </span>

    </div>
  );
}


export default AIAnalysis;