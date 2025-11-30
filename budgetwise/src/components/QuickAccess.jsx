
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

const RESOURCE_LIBRARY = [
  {
    id: "budget_basics",
    title: "Where to Start with Budgeting",
    url: "https://example.com/budgeting-101",
    description: "Short guide on setting up your first budget and tracking it month to month.",
    tags: ["level_beginner"],
  },
  {
    id: "home_buying_intro",
    title: "Saving for a Home: How Much Do You Need?",
    url: "https://example.com/saving-for-a-house",
    description: "Explains down payments, closing costs, and timelines for first-time buyers.",
    tags: ["goal_home"],
  },
  {
    id: "debt_paydown",
    title: "How to Build a Simple Debt Paydown Plan",
    url: "https://example.com/debt-paydown",
    description: "Step-by-step checklist for organizing and paying down debt.",
    tags: ["goal_debt", "level_beginner"],
  },
  {
    id: "emergency_fund",
    title: "Building an Emergency Fund Without Feeling Deprived",
    url: "https://example.com/emergency-fund",
    description: "Small, realistic steps to build a rainy-day fund.",
    tags: ["goal_emergency_fund", "level_beginner"],
  },
  {
    id: "restaurant_spend",
    title: "Cutting Back on Eating Out (Without Staying Home Every Night)",
    url: "https://example.com/restaurants-spend",
    description: "Tips for keeping restaurant and takeout spending in check.",
    tags: ["category_restaurants"],
  },
  {
    id: "shopping_spend",
    title: "Taming Impulse Shopping",
    url: "https://example.com/shopping-spend",
    description: "Simple rules and tricks to reduce unplanned shopping.",
    tags: ["category_shopping"],
  },
  {
    id: "transport_spend",
    title: "Car & Transport Costs: What to Expect Each Month",
    url: "https://example.com/transport-spend",
    description: "Helps estimate gas, insurance, maintenance, and other car-related costs.",
    tags: ["category_transport"],
  },
];

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
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              Based on your quiz answers, we picked a few things to help with your current goals.
            </p>
            {recommendations.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {recommendations.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--color-primary)] underline"
                    >
                      {item.title}
                    </a>
                    {item.description && (
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">
                We don't have specific suggestions yet, but your quiz answers will help us personalize this space as you go.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
