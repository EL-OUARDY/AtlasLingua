function Summarization() {
  return (
    <>
      <h1 className="hidden sm:block text-lg font-semibold md:text-2xl">
        Summarization
      </h1>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Have your media on your native language
          </h3>
          <p className="text-sm text-muted-foreground">
            Leverage the power of our AI algorithms to get your media translated
            to your native language.
          </p>
        </div>
      </div>
    </>
  );
}

export default Summarization;
