import { Link } from "react-router-dom";

function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      to="/"
      className="inline-flex items-baseline gap-2"
      aria-label="NOVA — Technology, refined. Go to homepage"
    >
      <span
        className={`text-[19px] font-semibold leading-none tracking-[0.28em] ${
          inverted ? "text-white" : "text-ink"
        }`}
      >
        NOVA
      </span>
      <span
        className={`hidden text-[11px] leading-none tracking-[0.02em] lg:inline ${
          inverted ? "text-white/50" : "text-ink-300"
        }`}
      >
        Technology, refined.
      </span>
    </Link>
  );
}

export default Logo;
