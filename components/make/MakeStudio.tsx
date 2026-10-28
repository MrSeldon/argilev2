"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/useAuth";
import { toUploadJpeg, ImagePrepError } from "@/lib/shelf/image";

/**
 * Make: the conversation with Drawn True. She sends a sketch (and words), Drawn True asks a few pottery questions,
 * shows each step with its picture, and sends back the render, the throwing or building sheet and the templates.
 * Messages live in argile_dt_messages (RLS: her own only); Drawn True on Devin's studio Mac picks them up every few
 * seconds and posts replies, which arrive here live (Realtime) with a slow poll as a fallback.
 */

type Msg = { id: number; direction: "in" | "out"; kind: "message" | "event"; text: string; step: string | null; image: string | null; created_at: string };

const WORDS = [
  { word: "GO", hint: "carry on / decide for me" },
  { word: "OK", hint: "approve what was sent" },
  { word: "WAIT", hint: "pause" },
  { word: "NEW", hint: "start a new piece" },
];

async function toDataUrl(file: File): Promise<string> {
  const blob = await toUploadJpeg(file, 1400);
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("read"));
    r.readAsDataURL(blob);
  });
}

function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function MakeStudio() {
  const { ready, user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [sketch, setSketch] = useState<{ url: string; data: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const pickRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastId = useRef(0);

  const merge = useCallback((rows: Msg[]) => {
    setMsgs((prev) => {
      const seen = new Map(prev.map((m) => [m.id, m]));
      rows.forEach((m) => seen.set(m.id, m));
      return [...seen.values()].sort((a, b) => a.id - b.id);
    });
  }, []);

  // Load the conversation, then listen for Drawn True's replies.
  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    let alive = true;
    const fetchAll = async (after = 0) => {
      const { data } = await sb
        .from("argile_dt_messages")
        .select("id,direction,kind,text,step,image,created_at")
        .gt("id", after)
        .order("id", { ascending: true })
        .limit(200);
      if (alive && data) merge(data as Msg[]);
      if (alive) setLoaded(true);
    };
    fetchAll();
    const ch = sb
      .channel(`make-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "argile_dt_messages", filter: `user_id=eq.${user.id}` }, (p) =>
        merge([p.new as Msg])
      )
      .subscribe();
    const slow = window.setInterval(() => fetchAll(lastId.current), 20000);   // in case the live channel drops
    return () => {
      alive = false;
      window.clearInterval(slow);
      sb.removeChannel(ch);
    };
  }, [user, merge]);

  useEffect(() => {
    lastId.current = msgs.length ? msgs[msgs.length - 1].id : 0;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs.length]);

  const onFile = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setError(null);
    try {
      const data = await toDataUrl(f);
      setSketch({ url: data, data });
    } catch (e) {
      setError(e instanceof ImagePrepError ? e.message : "Couldn’t open that photo. Try another, or take a screenshot of it.");
    }
  };

  const send = async (body: string, image?: string | null) => {
    const sb = getSupabase();
    if (!sb || !user || sending) return;
    if (!body.trim() && !image) return;
    setSending(true);
    setError(null);
    const { data, error: e } = await sb
      .from("argile_dt_messages")
      .insert({ user_id: user.id, direction: "in", text: body.trim(), image: image || null })
      .select("id,direction,kind,text,step,image,created_at")
      .single();
    setSending(false);
    if (e || !data) {
      setError("That didn’t send. Check your connection and try again.");
      return;
    }
    merge([data as Msg]);
    setText("");
    setSketch(null);
  };

  if (!ready) return <div className="py-16" aria-hidden />;

  if (!user) {
    return (
      <div className="py-12 max-w-xl">
        <p className="text-body-lg text-ink-2">
          Sign in to send a sketch. Your sketches, the questions and the renders stay with your account, on your phone and your laptop.
        </p>
        <Link href="/login?next=%2Fmake" className="btn-primary mt-6 inline-flex">
          Sign in
        </Link>
      </div>
    );
  }

  const waiting = msgs.length > 0 && msgs[msgs.length - 1].direction === "in";

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="flex-1 py-6 md:py-10 space-y-5">
        {loaded && msgs.length === 0 && (
          <div className="max-w-xl">
            <p className="eyebrow mb-4">How it works</p>
            <ol className="space-y-3 text-body-md text-ink-2 list-decimal pl-5">
              <li>Photograph your sketch, seen from the side, with a height written on it if you know it.</li>
              <li>I ask two or three questions: wheel or hand-built, smooth or as drawn, which glaze.</li>
              <li>You get a photo-real render in your glaze, the throwing or building sheet, and the templates to print.</li>
            </ol>
          </div>
        )}

        {msgs.map((m) =>
          m.kind === "event" ? (
            <div key={m.id} className="flex gap-3 items-start max-w-[92%] md:max-w-[80%]">
              <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-celadon" aria-hidden />
              <div className="min-w-0">
                {m.step && <p className="text-label uppercase text-ink-3">{m.step}</p>}
                <p className="text-body-sm text-ink-2 whitespace-pre-wrap">{m.text}</p>
                {m.image && (
                  <button type="button" onClick={() => setOpen(m.image)} className="mt-2 block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={m.step || "Step picture"} className="max-h-40 border border-line" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div key={m.id} className={`flex ${m.direction === "in" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] md:max-w-[80%] ${
                  m.direction === "in"
                    ? "bg-ink text-paper rounded-2xl rounded-br-sm"
                    : "bg-paper-soft border border-line text-ink rounded-2xl rounded-bl-sm"
                } overflow-hidden`}
              >
                {m.image && (
                  <button type="button" onClick={() => setOpen(m.image)} className="block w-full bg-oat">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={m.direction === "in" ? "Your sketch" : "From Drawn True"} className="w-full max-h-[28rem] object-contain" />
                  </button>
                )}
                {m.text && <div className="px-5 py-4 whitespace-pre-wrap text-body-md leading-relaxed">{m.text}</div>}
                <div className={`px-5 pb-2 text-[11px] ${m.direction === "in" ? "text-paper/60" : "text-ink-3"}`}>{when(m.created_at)}</div>
              </div>
            </div>
          )
        )}

        {waiting && (
          <div className="flex justify-start">
            <div className="bg-paper-soft border border-line rounded-2xl rounded-bl-sm px-5 py-4" role="status" aria-label="Drawn True is working">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-breathe" />
                <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-breathe" style={{ animationDelay: "0.3s" }} />
                <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-breathe" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-[var(--tabbar)] md:bottom-0 bg-paper/95 backdrop-blur-md border-t border-line py-3 md:py-5">
        {msgs.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1" aria-label="Quick replies">
            {WORDS.map((w) => (
              <button
                key={w.word}
                type="button"
                onClick={() => send(w.word)}
                disabled={sending}
                title={w.hint}
                className="shrink-0 min-h-10 px-4 rounded-full border border-line-strong text-label uppercase text-ink-2 hover:border-ink hover:text-ink transition-colors duration-400"
              >
                {w.word}
              </button>
            ))}
          </div>
        )}
        {sketch && (
          <div className="mb-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sketch.url} alt="Sketch to send" className="h-16 w-16 object-cover border border-line" />
            <button type="button" onClick={() => setSketch(null)} className="text-body-sm text-ink-3 underline underline-offset-4 min-h-11">
              Remove
            </button>
          </div>
        )}
        {error && <p className="mb-2 text-body-sm text-rust">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text, sketch?.data);
          }}
          className="flex gap-2 md:gap-3 items-center"
        >
          <button
            type="button"
            onClick={() => camRef.current?.click()}
            className="shrink-0 w-12 h-12 rounded-full border border-line-strong flex items-center justify-center text-ink-2 hover:text-ink"
            aria-label="Take a photo of your sketch"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => pickRef.current?.click()}
            className="shrink-0 w-12 h-12 rounded-full border border-line-strong flex items-center justify-center text-ink-2 hover:text-ink"
            aria-label="Choose a photo of your sketch"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <rect x="4" y="5" width="16" height="14" />
              <path d="M4 16l5-5 4 4 3-3 4 4" />
            </svg>
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={msgs.length ? "Answer, or ask for a change" : "What is it? (optional)"}
            className="flex-1 min-w-0 px-4 min-h-12 text-base bg-paper-soft border border-line-strong rounded-full focus:border-ink outline-none transition-colors duration-400 placeholder:text-ink-3/70"
          />
          <button type="submit" disabled={sending || (!text.trim() && !sketch)} className="btn-primary rounded-full min-h-12 px-5 disabled:opacity-50">
            Send
          </button>
        </form>
        <p className="text-[11px] text-ink-3 mt-2 text-center">Renders are made on the studio computer. If it’s off, your sketch waits and is picked up when it’s back.</p>
        <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { void onFile(e.target.files); e.target.value = ""; }} />
        <input ref={pickRef} type="file" accept="image/*" className="hidden" onChange={(e) => { void onFile(e.target.files); e.target.value = ""; }} />
      </div>

      {open && (
        <div className="fixed inset-0 z-[1500] bg-ink/90 flex flex-col" role="dialog" aria-label="Picture">
          <div className="flex justify-between items-center p-3">
            <a href={open} download="le-four-argile.jpg" className="text-paper text-label uppercase min-h-11 inline-flex items-center px-2">
              Save
            </a>
            <button type="button" onClick={() => setOpen(null)} className="text-paper text-label uppercase min-h-11 px-2">
              Close
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-3" onClick={() => setOpen(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open} alt="Full size" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
