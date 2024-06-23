function Contribution() {
  return (
    <>
      <h1 className="hidden sm:block text-lg font-semibold md:text-2xl">
        Contribution
      </h1>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Got something to share!
          </h3>
          <p className="text-sm text-muted-foreground">
            Our application grows with contributions from community members! We
            appreciate any contribution comes from you.
          </p>
        </div>
      </div>
    </>
  );
}

export default Contribution;
