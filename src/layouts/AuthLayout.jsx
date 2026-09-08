export default function AuthLayout({ institutionalContent, children }) {
  return (
    <>
      <a
        href="#sign-in"
        className="sr-only z-50 rounded-control bg-primary p-3 text-surface focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to sign in
      </a>
      <main className="min-h-svh border-t-4 border-primary md:grid md:grid-cols-[46%_54%]">
        <aside
          aria-label="System information"
          className="border-b border-default bg-canvas px-6 py-5 md:border-r md:border-b-0 md:px-8 md:py-8 xl:px-16 xl:py-10"
        >
          {institutionalContent}
        </aside>
        <section
          aria-labelledby="sign-in-title"
          className="flex items-center justify-center bg-surface px-4 py-6 sm:px-8 md:py-8 lg:px-12"
        >
          <div className="w-full max-w-md">{children}</div>
        </section>
      </main>
    </>
  );
}
