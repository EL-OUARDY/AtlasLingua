function Contact() {
  return (
    <>
      <h1 className="hidden text-xl font-bold tracking-tight sm:block md:text-2xl">
        Contact Us
      </h1>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Get in touch?</h3>
          <p className="text-sm text-muted-foreground">
            Send us a message and we will reply as soon as possible
          </p>
        </div>
      </div>
    </>
  );
}

export default Contact;
