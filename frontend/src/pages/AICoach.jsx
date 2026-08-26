import { useEffect, useRef, useState } from "react";

import {
  Bot,
  BrainCircuit,
  ChevronRight,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import AppShell from "../components/AppShell";
import { sendCoachMessage } from "../services/coach";


const SUGGESTIONS = [
  "Why has my bench press stalled?",
  "Analyze my recent workouts.",
  "How is my training progressing?",
  "What should I focus on this week?",
];


function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);


  async function handleSend(messageOverride = "") {
    const message = (
      messageOverride || input
    ).trim();

    if (!message || loading) {
      return;
    }

    setInput("");
    setError("");


    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };


    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);


    try {
      setLoading(true);

      const data = await sendCoachMessage(message);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data?.answer ||
          "I couldn't generate a response.",
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

    } catch (err) {
      console.error("AI Coach error:", err);

      setError(
        err.response?.data?.detail ||
          "Could not connect to AI Coach."
      );

    } finally {
      setLoading(false);
    }
  }


  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  }


  function clearChat() {
    if (loading) {
      return;
    }

    setMessages([]);
    setError("");
  }


  return (
    <AppShell
      eyebrow="AI COACH"
      title="TitanLift Coach"
    >

      <div className="mx-auto max-w-5xl">

        {/* ============================================
            INTRO
        ============================================ */}

        <section className="mb-6">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">
                <BrainCircuit
                  size={22}
                  className="text-lime-400"
                />
              </div>


              <div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                  PERSONALIZED FITNESS INTELLIGENCE
                </p>

                <h1 className="mt-1 text-3xl font-black">
                  AI Coach
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/30">
                  Ask questions about your training,
                  workouts, progress, and exercise form.
                </p>

              </div>

            </div>


            <div className="flex flex-wrap gap-2">

              <FeaturePill
                icon={Bot}
                text="AI Coach"
              />

              <FeaturePill
                icon={BrainCircuit}
                text="Personalized"
              />

              <FeaturePill
                icon={ShieldCheck}
                text="Grounded"
              />

            </div>

          </div>

        </section>


        {/* ============================================
            CHAT
        ============================================ */}

        <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b0d0d]">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10">

                <Bot
                  size={18}
                  className="text-lime-400"
                />

              </div>


              <div>

                <p className="text-sm font-semibold">
                  TitanLift Coach
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />

                  <span className="text-[10px] font-semibold tracking-[0.12em] text-white/25">
                    ONLINE
                  </span>

                </div>

              </div>

            </div>


            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-white/25 hover:bg-white/[0.04] hover:text-white/60 disabled:opacity-30"
              >
                Clear
              </button>
            )}

          </div>


          {/* Messages */}

          <div className="min-h-[520px] max-h-[650px] overflow-y-auto p-5 sm:p-6">

            {messages.length === 0 ? (

              <CoachEmptyState
                onSelect={handleSend}
              />

            ) : (

              <div className="space-y-5">

                {messages.map((message) => (
                  <CoachMessage
                    key={message.id}
                    message={message}
                  />
                ))}


                {loading && (
                  <TypingIndicator />
                )}


                <div ref={messagesEndRef} />

              </div>

            )}

          </div>


          {/* Error */}

          {error && (
            <div className="border-t border-red-500/10 bg-red-500/[0.04] px-5 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Input */}

          <div className="border-t border-white/[0.06] p-4 sm:p-5">

            <div className="rounded-2xl border border-white/10 bg-[#050606] p-2 focus-within:border-lime-400/30">

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={2}
                maxLength={2000}
                placeholder="Ask your coach anything..."
                className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-white/20 disabled:opacity-50"
              />


              <div className="flex items-center justify-between px-2 pb-1">

                <p className="hidden text-[10px] text-white/20 sm:block">
                  Enter to send · Shift + Enter for a new line
                </p>


                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="ml-auto flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  {loading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={15} />
                  )}

                  {loading
                    ? "Thinking..."
                    : "Send"}

                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

    </AppShell>
  );
}


/* ========================================================
   FEATURE PILL
======================================================== */

function FeaturePill({
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


/* ========================================================
   EMPTY STATE
======================================================== */

function CoachEmptyState({
  onSelect,
}) {
  return (
    <div className="flex min-h-[470px] flex-col items-center justify-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400/10">

        <MessageCircle
          size={28}
          className="text-lime-400"
        />

      </div>


      <h3 className="mt-6 text-xl font-bold">
        What can I help you with?
      </h3>


      <p className="mt-2 max-w-md text-center text-sm leading-6 text-white/30">
        Ask TitanLift about your workouts,
        progress, form, or next training step.
      </p>


      <div className="mt-7 grid w-full max-w-xl gap-2 sm:grid-cols-2">

        {SUGGESTIONS.map((suggestion) => (

          <button
            key={suggestion}
            type="button"
            onClick={() =>
              onSelect(suggestion)
            }
            className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-left hover:border-lime-400/15 hover:bg-lime-400/[0.03]"
          >

            <span className="text-xs text-white/40 group-hover:text-white/65">
              {suggestion}
            </span>

            <ChevronRight
              size={14}
              className="text-white/15 group-hover:text-lime-400"
            />

          </button>

        ))}

      </div>

    </div>
  );
}


/* ========================================================
   MESSAGE
======================================================== */

function CoachMessage({
  message,
}) {
  const isUser =
    message.role === "user";


  return (
    <div
      className={`flex items-start gap-3 ${
        isUser
          ? "justify-end"
          : ""
      }`}
    >

      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-400/10">

          <Bot
            size={16}
            className="text-lime-400"
          />

        </div>
      )}


      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[78%] ${
          isUser
            ? "rounded-tr-md bg-lime-400"
            : "rounded-tl-md border border-white/[0.05] bg-white/[0.02]"
        }`}
      >

        <div className="flex items-center gap-2">

          {isUser ? (
            <UserRound
              size={13}
              className="text-black/45"
            />
          ) : (
            <Sparkles
              size={13}
              className="text-lime-400"
            />
          )}


          <span
            className={`text-[10px] font-bold tracking-[0.15em] ${
              isUser
                ? "text-black/45"
                : "text-white/25"
            }`}
          >
            {isUser
              ? "YOU"
              : "TITANLIFT COACH"}
          </span>

        </div>


        <p
          className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${
            isUser
              ? "text-black/80"
              : "text-white/65"
          }`}
        >
          {message.content}
        </p>

      </div>

    </div>
  );
}


/* ========================================================
   TYPING INDICATOR
======================================================== */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400/10">

        <Bot
          size={16}
          className="text-lime-400"
        />

      </div>


      <div className="rounded-2xl rounded-tl-md border border-white/[0.05] bg-white/[0.02] px-4 py-3">

        <div className="flex items-center gap-2">

          <Loader2
            size={15}
            className="animate-spin text-lime-400"
          />

          <span className="text-sm text-white/40">
            Thinking...
          </span>

        </div>

      </div>

    </div>
  );
}


export default AICoach;