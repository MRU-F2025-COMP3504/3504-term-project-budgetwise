
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

const RESOURCE_LIBRARY = [
  // Budget basics / beginner-friendly
  {
    id: "budget_basics_fcac",
    title: "Making a Budget (Government of Canada)",
    url: "https://www.canada.ca/en/financial-consumer-agency/services/make-budget.html",
    description: "Step-by-step guide from the Financial Consumer Agency of Canada on how to build a budget.",
    tags: ["level_beginner"],
  },
  {
    id: "budget_planner_tool",
    title: "Interactive Budget Planner",
    url: "https://itools-ioutils.fcac-acfc.gc.ca/BP-PB/budget-planner",
    description: "Free Canadian government tool to build and save your own budget plan.",
    tags: ["level_beginner"],
  },
  {
    id: "budget_basics_douglas",
    title: "Income, Expenses and Budget (Student-Friendly Guide)",
    url: "https://guides.douglascollege.ca/FinancialLiteracy/Budget",
    description: "Plain-language walkthrough of income, expenses, and how to create a realistic budget.",
    tags: ["level_beginner"],
  },

  // Home buying / housing goals
  {
    id: "home_buying_fcac",
    title: "Buying a Home (Government of Canada)",
    url: "https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html",
    description: "Explains down payments, closing costs, and how much house you can afford in Canada.",
    tags: ["goal_home"],
  },
  {
    id: "home_buying_cmhc",
    title: "CMHC Homebuying Step-by-Step",
    url: "https://www.cmhc-schl.gc.ca/en/consumers/home-buying/buying-home-step-by-step",
    description: "Canada Mortgage and Housing Corporation’s full guide for first-time home buyers.",
    tags: ["goal_home"],
  },

  // Debt repayment
  {
    id: "debt_basics_fcac",
    title: "Debt and Borrowing (Government of Canada)",
    url: "https://www.canada.ca/en/financial-consumer-agency/services/debt.html",
    description: "Overview of common types of debt and strategies to manage and pay them down.",
    tags: ["goal_debt", "level_beginner"],
  },
  {
    id: "debt_repayment_nomoredebts",
    title: "Impulse Spending: Check Your TEMPO",
    url: "https://nomoredebts.org/budgeting/budgeting-tips/check-your-shopping-impulse",
    description: "Non-profit guide on recognizing triggers and getting spending back under control.",
    tags: ["goal_debt", "category_shopping"],
  },

  // Emergency fund / savings
  {
    id: "emergency_fund_wealthsimple",
    title: "Emergency Funds: What, Why, and How Much",
    url: "https://www.wealthsimple.com/en-ca/learn/emergency-funds",
    description: "Explains what an emergency fund is and how many months of expenses to aim for.",
    tags: ["goal_emergency_fund", "level_beginner"],
  },
  {
    id: "emergency_fund_questrade",
    title: "How Much Emergency Fund Do You Need?",
    url: "https://www.questrade.com/learning/building-your-emergency-fund",
    description: "Canadian-focused breakdown of how to balance debt repayment and emergency savings.",
    tags: ["goal_emergency_fund"],
  },

  // Restaurant / eating out spending
  {
    id: "restaurant_spend_sunlife",
    title: "How to Save Money When Eating Out",
    url: "https://www.sunlife.ca/en/tools-and-resources/money-and-finances/managing-your-money/how-to-save-money-when-eating-out/",
    description: "Practical ideas for enjoying meals out without blowing your budget.",
    tags: ["category_restaurants"],
  },

  // Shopping / impulse spending
  {
    id: "shopping_spend_rbc",
    title: "How to Control Impulse Spending",
    url: "https://www.rbcroyalbank.com/en-ca/my-money-matters/debt-and-stress-relief/struggling-to-make-ends-meet/managing-expenses/so-you-want-to-know-how-to-control-impulse-spending/",
    description: "Tips from RBC on spotting your impulse triggers and sticking to your plan.",
    tags: ["category_shopping"],
  },

  // Transport / car costs
  {
    id: "transport_spend_caa_calc",
    title: "CAA Driving Cost Calculator",
    url: "https://www.caa.ca/resources/car-cost-calculator/",
    description: "Estimates gas, insurance, maintenance, and other car-related costs for Canadian drivers.",
    tags: ["category_transport"],
  },
  {
    id: "transport_spend_caa_article",
    title: "Buying & Owning a Vehicle: Hidden Costs",
    url: "https://caaniagara.ca/auto/buying-and-selling",
    description: "Breaks down the ongoing costs of owning a car beyond just the purchase price.",
    tags: ["category_transport"],
  },
];

function getIconForResource(resource) {
  const tags = resource?.tags || [];
  if (tags.includes("goal_home")) return "🏠";
  if (tags.includes("goal_debt")) return "📉";
  if (tags.includes("goal_emergency_fund")) return "☔️";
  if (tags.includes("category_transport")) return "🚗";
  if (tags.includes("category_restaurants")) return "🍽️";
  if (tags.includes("category_shopping")) return "🛍️";
  if (tags.includes("level_beginner")) return "✨";
  return "💡";
}

function buildRecommendationsFromProfile(profile) {
  if (!profile) return [];

  const tags = new Set();

  // Fallback: inspect the entire profile text for hints if structured fields are missing
  const profileText = JSON.stringify(profile).toLowerCase();
  if (profileText.includes("house") || profileText.includes("home") || profileText.includes("mortgage")) {
    tags.add("goal_home");
  }
  if (profileText.includes("debt") || profileText.includes("loan") || profileText.includes("credit card")) {
    tags.add("goal_debt");
  }
  if (profileText.includes("emergency fund") || profileText.includes("rainy day")) {
    tags.add("goal_emergency_fund");
  }
  if (profileText.includes("restaurant") || profileText.includes("takeout") || profileText.includes("dining")) {
    tags.add("category_restaurants");
  }
  if (profileText.includes("shopping") || profileText.includes("retail")) {
    tags.add("category_shopping");
  }
  if (profileText.includes("car") || profileText.includes("gas") || profileText.includes("transport")) {
    tags.add("category_transport");
  }

  // Goals (short- and long-term)
  let goals = profile.goals || profile.longTermGoals || profile.financialGoals || [];
  if (!Array.isArray(goals)) {
    goals = goals ? [goals] : [];
  }
  goals.forEach((g) => {
    const lower = String(g).toLowerCase();
    if (lower.includes("house") || lower.includes("home") || lower.includes("mortgage")) {
      tags.add("goal_home");
    }
    if (lower.includes("debt") || lower.includes("loan")) {
      tags.add("goal_debt");
    }
    if (lower.includes("emergency") || lower.includes("rainy")) {
      tags.add("goal_emergency_fund");
    }
  });

  // Budgeting confidence / experience
  const experience = (profile.experienceLevel || profile.budgetConfidence || "")
    .toString()
    .toLowerCase();
  if (experience === "low" || experience === "beginner" || experience === "new") {
    tags.add("level_beginner");
  }
  if (experience === "medium" || experience === "intermediate") {
    tags.add("level_intermediate");
  }

  // Top spending categories
  const topCategories = profile.topSpendingCategories || profile.spendingCategories || [];
  if (Array.isArray(topCategories)) {
    topCategories.forEach((c) => {
      const lower = String(c).toLowerCase();
      if (
        lower.includes("eating") ||
        lower.includes("restaurant") ||
        lower.includes("dining") ||
        lower.includes("takeout")
      ) {
        tags.add("category_restaurants");
      }
      if (lower.includes("shopping") || lower.includes("retail")) {
        tags.add("category_shopping");
      }
      if (lower.includes("transport") || lower.includes("car") || lower.includes("gas")) {
        tags.add("category_transport");
      }
    });
  }

  // Score resources by tag overlap
  const scored = RESOURCE_LIBRARY.map((r) => {
    const score = r.tags.reduce((sum, t) => sum + (tags.has(t) ? 1 : 0), 0);
    return { resource: r, score };
  }).filter((x) => x.score > 0);

  // If we couldn't infer any specific tags, fall back to a generic starter set
  if (scored.length === 0) {
    return RESOURCE_LIBRARY.filter((r) => r.tags.includes("level_beginner")).slice(0, 4);
  }

  // Sort by highest score and take top few
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((x) => x.resource);
}

export default function QuickAccess({ links = [] }) {
  const variantClass = (v) => {
    switch (v) {
      case 'primary': return 'bw-btn bw-btn-primary';
      case 'accent': return 'bw-btn bw-btn-accent';
      case 'neutral':
      default: return 'bw-btn bw-btn-neutral';
    }
  };

  return (
    <div className="bw-card p-6" style={{ background: 'var(--surface-raised)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--textcolor2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quick Access
      </h3>
      <div className="flex gap-3 flex-wrap">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={variantClass(l.variant)}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Shared personalized panel for quiz-based recommendations
export function PersonalizedForYouPanel() {
  const { user } = useAuth();
  const [quizProfile, setQuizProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndRecs = async () => {
      if (!user) {
        setQuizProfile(null);
        setRecommendations([]);
        return;
      }
  
      setProfileLoading(true);
      try {
        const { data } = await api.profile.get();
        const profile = data?.profile || null;
        setQuizProfile(profile);
        setRecommendations(buildRecommendationsFromProfile(profile));
      } catch (err) {
        console.error("Failed to load quiz profile via api.profile.get", err);
        setQuizProfile(null);
        setRecommendations([]);
      } finally {
        setProfileLoading(false);
      }
    };
  
    fetchProfileAndRecs();
  }, [user]);

  if (!user) return null;

  return (
    <section className="mt-8">
      <div className="bw-card p-6">
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--textcolor1)' }}>
          Personalized for You
        </h2>

        {profileLoading && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Loading your quiz profile...
          </p>
        )}

        {!profileLoading && !quizProfile && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Take the BudgetWise onboarding quiz to unlock tailored tips and resources.
          </p>
        )}

{quizProfile && (
          <>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">
              Based on your quiz answers, here are a few hand-picked resources that match where you're at right now.
            </p>
            {recommendations.length > 0 ? (
              <ul className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
                {recommendations.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--surface-raised)]/70 p-3 shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all duration-200 cursor-pointer"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col h-full"
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <div className="text-xl" aria-hidden="true">
                          {getIconForResource(item)}
                        </div>
                        <h3 className="font-semibold leading-snug text-[var(--textcolor1)]">
                          {item.title}
                        </h3>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-[var(--color-text-muted)] leading-snug flex-1">
                          {item.description}
                        </p>
                      )}
                      <span className="mt-2 text-[10px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                        Open guide →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                We don't have specific suggestions yet, but your quiz answers will help us personalize this space as you go.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
