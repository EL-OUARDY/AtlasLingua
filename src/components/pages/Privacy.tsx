function Privacy() {
  return (
    <>
      <h1 className="hidden text-xl font-bold tracking-tight sm:block md:text-2xl">
        Privacy Policy
      </h1>
      <div className="flex flex-1 items-center justify-center p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Your privacy is protected!
          </h3>
          <p className="text-sm text-muted-foreground">
            We do not collect any sensitive data about you. Trust us!
          </p>
        </div>
      </div>
    </>
  );
}

export default Privacy;
