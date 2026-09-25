import { AlertTriangle } from 'lucide-react'

/**
 * Shown instead of the admin panel when the Supabase environment variables are
 * missing, so the failure is a readable instruction rather than a stack trace.
 */
export default function SetupRequired() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ocean-deep px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-soft">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/15 text-coral-dark">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ocean-deep">
          Supabase isn&apos;t connected yet
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          The site is running on its built-in demo content. To turn on the database and the admin
          panel, create a <code className="rounded bg-ink/5 px-1.5 py-0.5">.env.local</code> file in
          the project root with:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink/5 p-4 text-xs leading-relaxed text-ink/80">
          {`NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>`}
        </pre>
        <p className="mt-4 text-sm text-ink/70">
          Both values are in your Supabase dashboard under{' '}
          <strong className="font-semibold text-ocean-deep">Project Settings → API</strong>. Restart
          the dev server afterwards. Full instructions are in{' '}
          <code className="rounded bg-ink/5 px-1.5 py-0.5">SETUP.md</code>.
        </p>
      </div>
    </div>
  )
}
