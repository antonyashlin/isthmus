"use client";

import { useState } from "react";

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
  const [type, setType] = useState<string>(TYPES[0]);
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const empty = note.trim().length === 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (empty) return;
    const subject = encodeURIComponent(`Inquiry — ${type}`);
    const body = encodeURIComponent(note.trim());
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

        <form className="form liquid-glass" noValidate onSubmit={submit}>
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

          {touched && empty ? (
            <p className="field-error" id="inq-error" role="alert">
              Add a short note so we know what you need.
            </p>
          ) : null}

          <button className="btn btn-glass liquid-glass form-send" type="submit">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
