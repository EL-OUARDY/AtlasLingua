function Community() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Community</h1>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You are not alone!
          </h3>
          <p className="text-sm text-muted-foreground">
            Make friends, share your thoughts and leverage the power of a great
            community.
          </p>
        </div>
      </div>
    </>
  );
}

export default Community;
