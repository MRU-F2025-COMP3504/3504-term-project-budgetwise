import StatementsPage from '../../FrontEnd/pages/StatementsPage'
import ClientPageWrapper from './ClientPageWrapper'

export const dynamic = 'force-dynamic'

// List of client-side pages
const clientPages = [
  'ai', 'budgets', 'categories', 'dashboard', 
  'login', 'profile', 'quiz', 'register', 'upload', 'transactions', 'statements'
]

export default async function Page(props) {
  const params = await props.params
  const pageName = params.page
  
  // Handle server-side data fetching pages
  // 'statements' now handled as a client page
  
  // 'transactions' is handled as a client page via ClientPageWrapper
  
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
