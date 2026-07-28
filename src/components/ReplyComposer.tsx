import { useEffect, useState } from "react";
import { Sparkles, RotateCw, Send, AlertCircle, Check } from "lucide-react";
import type {
  ComposerStatus,
  ReplySuggestion,
  ReplyTone,
  Ticket,
} from "../types";
import { replyGenerator } from "../services/mockReplyGenerator";
import { ToneVariantPicker } from "./ToneVariantPicker";
import "./ReplyComposer.css";

interface ReplyComposerProps {
  ticket: Ticket;
}

export function ReplyComposer({ ticket }: ReplyComposerProps) {
  const [status, setStatus] = useState<ComposerStatus>("idle");
  const [suggestions, setSuggestions] = useState<ReplySuggestion[]>([]);
  const [activeTone, setActiveTone] = useState<ReplyTone>("empathetic");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);
  const [sent, setSent] = useState(false);

  // Reset composer state whenever the selected ticket changes.
  useEffect(() => {
    setStatus("idle");
    setSuggestions([]);
    setDraft("");
    setError(null);
    setEdited(false);
    setSent(false);
  }, [ticket.id]);

  async function handleGenerate() {
    setStatus("generating");
    setError(null);
    try {
      const results = await replyGenerator.generateReplies({ ticket });
      setSuggestions(results);
      const preferred =
        results.find((r) => r.tone === activeTone) ?? results[0];
      setActiveTone(preferred.tone);
      setDraft(preferred.body);
      setEdited(false);
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong generating replies."
      );
      setStatus("error");
    }
  }

  function handleSelectTone(suggestion: ReplySuggestion) {
    setActiveTone(suggestion.tone);
    setDraft(suggestion.body);
    setEdited(false);
  }

  function handleDraftChange(value: string) {
    setDraft(value);
    setEdited(true);
  }

  function handleSend() {
    setSent(true);
  }

  const hasSuggestions = suggestions.length > 0;

  return (
    <section className="composer" aria-label="Reply composer">
      <div className="composer__toolbar">
        <div className="composer__toolbar-left">
          {!hasSuggestions ? (
            <button
              className="btn btn--primary"
              onClick={handleGenerate}
              disabled={status === "generating"}
            >
              <Sparkles size={15} />
              {status === "generating" ? "Generating…" : "Generate reply"}
            </button>
          ) : (
            <>
              <ToneVariantPicker
                suggestions={suggestions}
                activeTone={activeTone}
                onSelect={handleSelectTone}
              />
              <button
                className="btn btn--ghost"
                onClick={handleGenerate}
                disabled={status === "generating"}
                title="Regenerate all variants"
              >
                <RotateCw
                  size={14}
                  className={status === "generating" ? "spin" : ""}
                />
                Regenerate
              </button>
            </>
          )}
        </div>
      </div>

      {status === "error" && (
        <div className="composer__banner composer__banner--error">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="btn btn--link" onClick={handleGenerate}>
            Try again
          </button>
        </div>
      )}

      {status === "generating" && !hasSuggestions && (
        <div className="composer__skeleton" aria-live="polite" aria-label="Generating suggestions">
          <div className="skeleton-line" style={{ width: "92%" }} />
          <div className="skeleton-line" style={{ width: "85%" }} />
          <div className="skeleton-line" style={{ width: "70%" }} />
          <div className="skeleton-line" style={{ width: "88%" }} />
        </div>
      )}

      {(status === "idle" || status === "ready" || status === "error" || hasSuggestions) && (
        <div className="composer__body">
          <textarea
            className="composer__textarea"
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            placeholder="Generate an AI reply, or write your own here…"
            aria-label="Reply draft"
            rows={14}
          />
          <div className="composer__footer">
            <div className="composer__footer-status">
              {edited && hasSuggestions && (
                <span className="composer__edited-note">Edited from AI draft</span>
              )}
              {sent && (
                <span className="composer__sent-note">
                  <Check size={14} /> Sent to {ticket.customerName}
                </span>
              )}
            </div>
            <button
              className="btn btn--send"
              onClick={handleSend}
              disabled={!draft.trim() || sent}
            >
              <Send size={14} />
              {sent ? "Sent" : "Send reply"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
