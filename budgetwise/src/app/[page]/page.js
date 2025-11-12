import StatementsPage from '../../FrontEnd/pages/StatementsPage'
import TransactionsPage from '../../FrontEnd/pages/TransactionsPage'
import ClientPageWrapper from './ClientPageWrapper'

export const dynamic = 'force-dynamic'

// List of client-side pages
const clientPages = [
  'ai', 'budgets', 'categories', 'dashboard', 
  'login', 'profile', 'quiz', 'register', 'upload'
]

export default async function Page(props) {
  const params = await props.params
  const pageName = params.page
  
  // Handle server-side data fetching pages
  if (pageName === 'statements') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    const res = await fetch(`${baseUrl}/api/statements`, { cache: 'no-store' })
    const data = res.ok ? await res.json() : { Transactions: [] }
    
    return <StatementsPage statements={data?.Transactions ?? []} />
  }
  
  if (pageName === 'transactions') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    const res = await fetch(`${baseUrl}/api/transactions`, { cache: 'no-store' })
    const data = res.ok ? await res.json() : { Transactions: [] }
    
    return <TransactionsPage transactions={data?.Transactions ?? []} />
  }
  
  // Handle client-side pages
  if (clientPages.includes(pageName)) {
    return <ClientPageWrapper pageName={pageName} />
  }
  
  // 404 for unknown routes
  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Page Not Found</h1>
      <p>The page &quot;{pageName}&quot; does not exist.</p>
    </div>
  )
}
