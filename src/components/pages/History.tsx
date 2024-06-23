function History() {
  return (
    <>
      <h1 className="hidden sm:block text-lg font-semibold md:text-2xl">
        History
      </h1>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Nothing lost!</h3>
          <p className="text-sm text-muted-foreground">
            Everything saved for you.
          </p>
        </div>
      </div>
    </>
  );
}

export default History;
