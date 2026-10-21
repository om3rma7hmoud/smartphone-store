import { StarIcon } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  tone?: "ink" | "white";
}

export function StarRating({
  rating,
  size = 13,
  className = "",
  tone = "ink",
}: StarRatingProps) {
  const emptyClass = tone === "white" ? "text-white/25" : "text-line-strong";
  const fillClass =
    tone === "white" ? "text-white fill-white" : "text-ink fill-ink";
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = rating >= i + 0.75;
        const half = !filled && rating >= i + 0.25;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <StarIcon
              size={size}
              className={`absolute inset-0 ${emptyClass}`}
              strokeWidth={1.5}
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? size : size / 2 }}
              >
                <StarIcon size={size} className={fillClass} strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
