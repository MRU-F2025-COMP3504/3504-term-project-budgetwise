'use client'

import AIPage from '../../FrontEnd/pages/AIPage'
import BudgetsPage from '../../FrontEnd/pages/BudgetsPage'
import CategoriesPage from '../../FrontEnd/pages/CategoriesPage'
import DashboardPage from '../../FrontEnd/pages/DashboardPage'
import LoginPage from '../../FrontEnd/pages/LoginPage'
import ProfilePage from '../../FrontEnd/pages/ProfilePage'
import QuizPage from '../../FrontEnd/pages/QuizPage'
import RegisterPage from '../../FrontEnd/pages/RegisterPage'
import UploadPage from '../../FrontEnd/pages/UploadPage'

const clientPages = {
  ai: AIPage,
  budgets: BudgetsPage,
  categories: CategoriesPage,
  dashboard: DashboardPage,
  login: LoginPage,
  profile: ProfilePage,
  quiz: QuizPage,
  register: RegisterPage,
  upload: UploadPage,
}

export default function ClientPageWrapper({ pageName }) {
  const PageComponent = clientPages[pageName]
  
  if (!PageComponent) {
    return (
      <div className="bw-container">
        <h1 className="text-2xl font-semibold mb-4">Page Not Found</h1>
        <p>The page "{pageName}" does not exist.</p>
      </div>
    )
  }
  
  return <PageComponent />
}
