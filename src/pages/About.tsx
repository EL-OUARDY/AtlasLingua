function About() {
  return (
    <>
      <h1 className="hidden sm:block text-lg font-semibold md:text-2xl">
        About Us
      </h1>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Get to know us better
          </h3>
          <p className="text-sm text-muted-foreground">
            Our stroy, vision and all about us.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
