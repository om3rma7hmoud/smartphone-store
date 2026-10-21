import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-accent mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
          404
        </p>

        <h1 className="text-ink text-4xl font-bold tracking-tight sm:text-5xl">
          Product not found
        </h1>

        <p className="text-ink-400 mt-4 text-sm leading-6 sm:text-base">
          The product you're looking for doesn't exist or may have been removed.
        </p>

        <Link
          to="/"
          className="bg-accent hover:bg-accent-hover mt-8 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
