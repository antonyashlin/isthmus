"use client";

import { useState } from "react";

import { GlassDecor, GlassLabel } from "@/components/site/glass";

/**
 * Inquiry form.
 *
 * The site is a static export with no backend, so there is nothing to POST to.
 * Rather than fake a submit that silently drops the message, Send composes a
 * mailto: to info@ with the type as the subject and the note as the body — the
 * message actually leaves. Swap this for a real endpoint (Pages Function or a
 * form service) whenever one exists; only `submit` needs to change.
 */

const TYPES = [
  "Transaction support",
  "Embedded back office",
  "Portfolio and fund support",
  "Something else",
] as const;

const INBOX = "info@isthmusmeridian.com";

export default function Inquiry() {
  const [who, setWho] = useState("");
  const [type, setType] = useState<string>(TYPES[0]);
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const empty = note.trim().length === 0;
  const noWho = who.trim().length === 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (empty || noWho) return;
    // The subject carries who it is from, so the inbox can triage without
    // opening anything; the name repeats in the body because some clients
    // truncate long subjects.
    const subject = encodeURIComponent(`Inquiry — ${type} — ${who.trim()}`);
    const body = encodeURIComponent(`${who.trim()}\n\n${note.trim()}`);
    window.location.href = `mailto:${INBOX}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="formpage">
      <div className="formwrap">
        <a className="form-back" href="/">
          ← Isthmus Meridian
        </a>

        <h1 className="h-lg form-head">
          Tell us what you <span className="serif-i">need</span>.
        </h1>
        <p className="body form-lede">
          Describe the work and we will come back to you. If you would rather
          write directly, we are at{" "}
          <a href={`mailto:${INBOX}`}>{INBOX}</a>.
        </p>

        {/* GlassPanel's shell is a fixed <div> — this needs to stay a real
            <form> for onSubmit, so the two-layer pattern is built by hand
            here instead, same shape as GlassPanel itself. */}
        <form className="form lg-shell" noValidate onSubmit={submit}>
          <GlassDecor />
          <div className="form-fields lg-content">
            <label className="field" htmlFor="inq-who">
              <span className="field-label">Name and organisation</span>
              <input
                aria-describedby={touched && noWho ? "inq-who-error" : undefined}
                aria-invalid={touched && noWho}
                autoComplete="organization"
                className="field-input"
                id="inq-who"
                name="who"
                onChange={(e) => setWho(e.target.value)}
                placeholder="Jordan Reyes · Meridian Partners"
                type="text"
                value={who}
              />
            </label>

            {/* The slot stays mounted so CSS has something to transition from;
                the TEXT stays conditional so role="alert" still fires on the
                change rather than announcing on page load. */}
            <div className="field-error-slot" data-open={touched && noWho ? "" : undefined}>
              <p className="field-error" id="inq-who-error" role="alert">
                {touched && noWho ? "Tell us who you are so we can reply." : null}
              </p>
            </div>

            <label className="field" htmlFor="inq-type">
              <span className="field-label">Type of inquiry</span>
              <select
                className="field-input"
                id="inq-type"
                name="type"
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="field" htmlFor="inq-note">
              <span className="field-label">Your inquiry</span>
              <textarea
                aria-describedby={touched && empty ? "inq-error" : undefined}
                aria-invalid={touched && empty}
                className="field-input field-area"
                id="inq-note"
                name="note"
                onChange={(e) => setNote(e.target.value)}
                placeholder="A deal, a model, a reporting need, a fundraise, a research question…"
                rows={7}
                value={note}
              />
            </label>

            <div className="field-error-slot" data-open={touched && empty ? "" : undefined}>
              <p className="field-error" id="inq-error" role="alert">
                {touched && empty ? "Add a short note so we know what you need." : null}
              </p>
            </div>

            <button className="glass-btn glass-btn-lg form-send lg-shell" type="submit">
              <GlassLabel>Send</GlassLabel>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
