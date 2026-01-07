import { useEffect, useMemo, useState } from "react";
import "../styles/ChoosePoses.css";
import http from "../http/http";
import TokenUsageDisplay from "./tokenUsageDisplay";

export default function ChoosePoseModal({
  isOpen,
  poses = [],
  initialSelectedId = null,
  onClose,
  generate,
  title = "Select a pose",
  onError
}) {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [tokenUsage, setTokenUsage] = useState(null);

  useEffect(() => {
    if (isOpen) setSelectedId(initialSelectedId ?? null);

    const getTokenUsage = async () => {
      try{
        const res = await http.get(`/token-usage/generate-tryOn`);
        if(res.data.success){
          setTokenUsage(res.data.data)
        }
      }
      catch(err){
        onError(err)
      }
    }
    getTokenUsage();
  }, [isOpen, initialSelectedId]);

  const selectedPose = useMemo(
    () => poses.find((p) => p.id === selectedId) || null,
    [poses, selectedId]
  );

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="cps-overlay" onMouseDown={handleOverlayMouseDown}>
      <div className="cps-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="cps-header">
          <div>
            <div className="cps-title">{title}</div>
            <div className="cps-subtitle">Pick a pose — our AI will render the outfit on your body in that stance.</div>
          </div>

          <button className="cps-iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="cps-body">
          <div className="cps-grid">
            {poses.map((pose) => {
              const active = pose.id === selectedId;
              return (
                <button
                  type="button"
                  key={pose.id}
                  className={`cps-card ${active ? "active" : ""}`}
                  onClick={() => setSelectedId(pose.id)}
                >
                  <div className="cps-thumbWrap">
                    <img className="cps-thumb" src={pose.img} alt={pose.name} />
                    <div className={`cps-radio ${active ? "on" : ""}`} aria-hidden="true" />
                  </div>
                  <div className="cps-name" title={pose.name}>{pose.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cps-usageWrap">
          <TokenUsageDisplay usage={tokenUsage}/>
        </div>

        <div className="cps-footer">
          <div className="cps-preview">
            <div className="cps-previewLabel">Selected</div>
            <div className="cps-previewValue">
              {selectedPose ? selectedPose.name : "None"}
            </div>
          </div>

          <div className="cps-actions">
            <button className="cps-btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="cps-btn primary"
              disabled={!selectedId}
              onClick={() => generate?.({ selectedId, selectedPose, tokenUsage })}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
