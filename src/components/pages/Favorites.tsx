function Favorites() {
  return (
    <>
      <h1 className="hidden text-xl font-bold tracking-tight sm:block md:text-2xl">
        Favorites
      </h1>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Build your list!
          </h3>
          <p className="text-sm text-muted-foreground">
            Everything saved here! Get easy access to your saved words.
          </p>
        </div>
      </div>
    </>
  );
}

export default Favorites;
