import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bw-container">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">BudgetWise</h1>
        <p className="bw-text-muted mt-1">Track, categorize, and understand your spending.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="bw-card p-6">
          <h2 className="text-xl font-medium mb-2">Statements</h2>
          <p className="bw-text-muted mb-4">Upload and browse your bank statements.</p>
          <Link className="inline-block px-4 py-2 rounded-md bg-[var(--color-accent-2)] text-white hover:brightness-110 transition-colors" href="/statements">
            View Statements
          </Link>
        </div>
        <div className="bw-card p-6">
          <h2 className="text-xl font-medium mb-2">Transactions</h2>
          <p className="bw-text-muted mb-4">See all categorized transactions.</p>
          <Link className="inline-block px-4 py-2 rounded-md bg-[var(--color-accent)] text-black hover:brightness-110 transition-colors" href="/transactions">
            View Transactions
          </Link>
        </div>
        <div className="bw-card p-6">
          <h2 className="text-xl font-medium mb-2">AI Assistant</h2>
          <p className="bw-text-muted mb-4">Ask if you can afford something, get insights.</p>
          <button className="px-4 py-2 rounded-md bg-[var(--color-surface-2)] text-white opacity-60 cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </section>
    </div>
  );
}
