function Notifications() {
  return (
    <>
      <h1 className="hidden sm:block text-lg font-semibold md:text-2xl">
        Notifications
      </h1>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Stay in touch?</h3>
          <p className="text-sm text-muted-foreground">
            Here you'll find all notification that interest might you.
          </p>
        </div>
      </div>
    </>
  );
}

export default Notifications;
