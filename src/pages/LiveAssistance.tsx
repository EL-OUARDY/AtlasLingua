function LiveAssistance() {
  return (
    <>
      <h1 className="hidden sm:block text-lg font-semibold md:text-2xl">
        Live Assistance
      </h1>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Get help immediately!
          </h3>
          <p className="text-sm text-muted-foreground">
            Count on us! We can provide you realtime assistance for your own
            customized needs.
          </p>
        </div>
      </div>
    </>
  );
}

export default LiveAssistance;
