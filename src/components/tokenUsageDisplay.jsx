import React from "react";
import "../styles/TokenUsageDisplay.css";

export default function TokenUsageDisplay({ usage }) {
  if (!usage) return null;

  return (
    <div className="token-card">
      <div className="token-header">
        Usage & Cost
      </div>

      <div className="token-body">
        <div className="token-row">
          <span className="token-label">Tokens used</span>
          <span className="token-value">{usage.tokens}</span>
        </div>

        <div className="token-row">
          <span className="token-label">Cost</span>
          <span className="token-value highlight">{usage.costUi}</span>
        </div>
      </div>

      <div className="token-footer">
        This action consumed tokens from your balance.
      </div>
    </div>
  );
}
