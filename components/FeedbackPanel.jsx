"use client";
import { useEffect, useRef, useState } from "react";
import { supabase, FEEDBACK_TABLE } from "@/lib/supabase";

/**
 * Right-rail panel: textarea bound to Supabase row keyed by challenge_slug.
 * Auto-saves on change with a 600ms debounce.
 */
export default function FeedbackPanel({ slug, challengeNumber, challengeTitle }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("loading"); // loading | saved | saving | error | offline
  const [errorMsg, setErrorMsg] = useState("");
  const debounceRef = useRef(null);
  const initialLoad = useRef(true);

  // Initial fetch
  useEffect(() => {
    if (!supabase) {
      setStatus("offline");
      setErrorMsg("Supabase env vars missing.");
      initialLoad.current = false;
      return;
    }
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from(FEEDBACK_TABLE)
          .select("content")
          .eq("challenge_slug", slug)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          console.error("[Feedback] load:", error);
          setStatus("error");
          setErrorMsg(formatError(error));
        } else {
          setContent(data?.content || "");
          setStatus("saved");
          setErrorMsg("");
        }
      } catch (e) {
        if (cancelled) return;
        console.error("[Feedback] load threw:", e);
        setStatus("error");
        setErrorMsg(e?.message || String(e));
      } finally {
        initialLoad.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Auto-save on change (debounced)
  useEffect(() => {
    if (!supabase) return;
    if (initialLoad.current) return;
    if (!slug) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("saving");
    debounceRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from(FEEDBACK_TABLE)
          .upsert(
            {
              challenge_slug: slug,
              content,
              reviewer: "jay",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "challenge_slug" },
          );
        if (error) {
          console.error("[Feedback] save:", error);
          setStatus("error");
          setErrorMsg(formatError(error));
        } else {
          setStatus("saved");
          setErrorMsg("");
        }
      } catch (e) {
        console.error("[Feedback] save threw:", e);
        setStatus("error");
        setErrorMsg(e?.message || String(e));
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [content, slug]);

  return (
    <aside className="bg-white rounded-3xl shadow-md border-2 border-[var(--color-hoda-blue)]/30 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-3 flex items-center justify-between"
           style={{ background: "var(--color-hoda-blue)" }}>
        <span className="font-display font-bold text-white tracking-wider uppercase text-sm">
          Jay's Feedback
        </span>
        <StatusIndicator status={status} />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-neutral-400 mb-2 italic">
          Level {String(challengeNumber).padStart(2, "0")} — {challengeTitle}
        </p>
        {status === "error" && errorMsg && (
          <div className="mb-2 p-2 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800">
            {errorMsg}
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you change about this page? Anything wrong with the build, the steps, the visual?"
          className="flex-1 w-full p-4 rounded-xl border-2 border-neutral-200 focus:border-[var(--color-hoda-blue)] focus:outline-none resize-none text-base leading-relaxed font-body"
          style={{ minHeight: "60vh" }}
        />
      </div>
    </aside>
  );
}

function formatError(e) {
  if (!e) return "";
  if (e.code === "PGRST205") {
    return "Supabase table not visible to API yet. Try restarting the API in Supabase dashboard, or wait a minute.";
  }
  return e.message || e.code || JSON.stringify(e);
}

function StatusIndicator({ status }) {
  const map = {
    loading: { text: "Loading…", color: "rgba(255,255,255,0.7)" },
    saving: { text: "Saving…", color: "rgba(255,255,255,0.7)" },
    saved: { text: "Saved ✓", color: "rgba(255,255,255,0.95)" },
    error: { text: "Error", color: "#ffd6c2" },
    offline: { text: "Offline", color: "#ffd6c2" },
  };
  const s = map[status] || map.saved;
  return (
    <span className="text-xs font-bold" style={{ color: s.color }}>
      {s.text}
    </span>
  );
}
