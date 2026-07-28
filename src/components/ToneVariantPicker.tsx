import type { ReplySuggestion, ReplyTone } from "../types";
import "./ToneVariantPicker.css";

interface ToneVariantPickerProps {
  suggestions: ReplySuggestion[];
  activeTone: ReplyTone;
  onSelect: (suggestion: ReplySuggestion) => void;
}

function confidenceTier(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
}

export function ToneVariantPicker({
  suggestions,
  activeTone,
  onSelect,
}: ToneVariantPickerProps) {
  return (
    <div className="tone-picker" role="tablist" aria-label="Reply tone variants">
      {suggestions.map((s) => {
        const isActive = s.tone === activeTone;
        const tier = confidenceTier(s.confidence);
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={isActive}
            className={`tone-tab${isActive ? " tone-tab--active" : ""}`}
            onClick={() => onSelect(s)}
          >
            <span className="tone-tab__label">{s.label}</span>
            <span className={`tone-tab__confidence tone-tab__confidence--${tier}`}>
              {Math.round(s.confidence * 100)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
