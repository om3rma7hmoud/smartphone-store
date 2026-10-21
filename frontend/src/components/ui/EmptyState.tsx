import React from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: { label: string; to: string };
  secondaryAction?: { label: string; to: string };
}

function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="border-line bg-surface-muted flex flex-col items-center justify-center border px-6 py-20 text-center">
      <div className="border-line text-ink-400 mb-5 flex h-14 w-14 items-center justify-center rounded-full border bg-white">
        {icon}
      </div>
      <h2 className="text-ink text-xl font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <p className="text-ink-400 mt-2 max-w-sm text-[15px] leading-relaxed">
        {description}
      </p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="bg-ink ease-premium hover:bg-ink-800 inline-flex h-11 items-center justify-center px-6 text-[14px] font-medium text-white transition-colors duration-150"
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="border-line-strong text-ink ease-premium hover:border-ink inline-flex h-11 items-center justify-center border bg-white px-6 text-[14px] font-medium transition-colors duration-150"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
