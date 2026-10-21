function Spinner() {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="relative size-12">
        <div className="border-line absolute inset-0 rounded-full border-[3px]" />{" "}
        <div className="border-t-accent border-r-accent absolute inset-0 animate-spin rounded-full border-[3px] border-transparent" />{" "}
      </div>
    </div>
  );
}
export default Spinner;
