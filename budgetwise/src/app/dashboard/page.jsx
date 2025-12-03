"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StatSummary from "@/components/StatSummary";
import Table from "@/components/Table";
import { PersonalizedForYouPanel } from "@/components/QuickAccess";
import api from "@/services/api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = [
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

/**
 * Normalize the quiz profile into a predictable shape.
 * Handles multiple possible key names because the AI profile
 * may evolve over time.
 */
function normalizeProfile(raw) {
  if (!raw) return {};

  const income =
    Number(
      raw.monthly_income ??
        raw.monthlyIncome ??
        raw.income ??
        raw.monthlyIncomeEstimate ??
        0
    ) || 0;

  const budget =
    Number(
      raw.monthly_budget ??
        raw.monthlyBudget ??
        raw.budget ??
        raw.target_budget ??
        0
    ) || 0;

  const savingsGoal =
    Number(
      raw.monthly_savings_goal ??
        raw.monthlySavingsGoal ??
        raw.savings_goal ??
        raw.target_savings ??
        0
    ) || 0;

  const experience = (
    raw.experience_level ??
    raw.experience ??
    raw.financialExperience ??
    ""
  )
    .toString()
    .toLowerCase();

  const goalsText = [
    raw.financial_goals,
    raw.financialGoals,
    raw.top_goal,
    raw.primaryGoal,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const summaryText = (raw.summary ?? "").toString().toLowerCase();

  const hasDebt =
    !!raw.has_debt ||
    !!raw.debt_focus ||
    /debt|loan|credit card|line of credit|student loan/.test(
      goalsText + " " + summaryText
    );

  const irregularIncome =
    !!raw.irregular_income ||
    /irregular|contract|shift|variable|commission/.test(
      (raw.income_type ?? raw.job_type ?? summaryText)
        .toString()
        .toLowerCase()
    );

  return {
    income,
    budget,
    savingsGoal,
    experience,
    goalsText,
    summaryText,
    hasDebt,
    irregularIncome,
  };
}

/**
 * Classify the user into a high-level persona, based on quiz profile.
 */
function classifyPersona(profile) {
  if (!profile || (!profile.income && !profile.budget && !profile.savingsGoal)) {
    return "new_user";
  }

  const {
    income,
    budget,
    savingsGoal,
    hasDebt,
    irregularIncome,
    goalsText,
    experience,
  } = profile;

  const savingsRate = income > 0 ? savingsGoal / income : 0;
  const budgetRatio = income > 0 ? budget / income : 0;

  if (hasDebt) {
    return "debt_focused";
  }

  if (irregularIncome) {
    return "variable_spender";
  }

  if (budgetRatio < 0.5 && savingsRate >= 0.2) {
    return "planner_saver";
  }

  if (budgetRatio > 0.8 && savingsRate < 0.1) {
    return "overspender";
  }

  if (
    /home|house|condo|down payment|car|travel|wedding|school|tuition/.test(
      goalsText
    )
  ) {
    return "goal_driven";
  }

  if (/beginner|new|learning|never budgeted/.test(experience)) {
    return "starter";
  }

  return "general";
}

function getPersonaLabel(personaType) {
  switch (personaType) {
    case "overspender":
      return "Overspender (Spending-Heavy)";
    case "planner_saver":
      return "Planner / Saver";
    case "variable_spender":
      return "Variable Spender";
    case "debt_focused":
      return "Debt-Focused";
    case "goal_driven":
      return "Goal-Driven Planner";
    case "starter":
      return "Getting Started";
    case "new_user":
      return "New to BudgetWise";
    default:
      return "Balanced Spender";
  }
}

/**
 * Map persona → which charts to show.
 * The dashboard uses these keys to decide which chart sections to render.
 */
function getDashboardCharts(personaType) {
  switch (personaType) {
    case "overspender":
      return ["categoryPie", "budgetVsActual", "monthlyTrend"];
    case "planner_saver":
      return ["categoryPie", "savingsProjection", "monthlyTrend"];
    case "variable_spender":
      return ["monthlyTrend", "categoryPie"];
    case "debt_focused":
      return ["categoryPie", "budgetVsActual", "savingsProjection"];
    case "goal_driven":
      return ["categoryPie", "savingsProjection"];
    case "starter":
      return ["categoryPie", "monthlyTrend"];
    case "new_user":
      return ["onboardingPlaceholder"];
    default:
      return ["categoryPie", "monthlyTrend"];
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [personaType, setPersonaType] = useState("new_user");
  const [profileLoading, setProfileLoading] = useState(true);

  // Get user name
  const fullName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "there";
  const firstName = fullName.split(" ")[0];

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchAll = async () => {
      try {
        const [txRes, profileRes] = await Promise.allSettled([
          api.transactions.list(),
          api.profile.get(),
        ]);

        if (!isMounted) return;

        // Transactions
        if (txRes.status === "fulfilled") {
          const data = txRes.value?.data;
          setTransactions(data?.transactions || []);
        } else {
          console.error("Failed to fetch transactions:", txRes.reason);
          setTransactions([]);
        }
        setTxLoading(false);

        // Profile / Persona
        if (profileRes.status === "fulfilled") {
          const data = profileRes.value?.data;
          const rawProfile = data?.profile || null;
          setProfile(rawProfile);
          const normalized = normalizeProfile(rawProfile);
          setPersonaType(classifyPersona(normalized));
        } else {
          console.warn("No quiz profile yet:", profileRes.reason);
          setProfile(null);
          setPersonaType("new_user");
        }
        setProfileLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (!isMounted) return;
        setTransactions([]);
        setTxLoading(false);
        setProfile(null);
        setPersonaType("new_user");
        setProfileLoading(false);
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Aggregate key numbers
  const {
    totalNetFlow,
    totalOutflow,
    totalInflow,
    latestBalance,
    totalSpentAbs,
  } = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        totalNetFlow: 0,
        totalOutflow: 0,
        totalInflow: 0,
        latestBalance: null,
        totalSpentAbs: 0,
      };
    }

    const net = transactions.reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0
    );

    const out = transactions
      .filter((t) => Number(t.amount) < 0)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const inn = transactions
      .filter((t) => Number(t.amount) > 0)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const latest =
      transactions
        .map((t) => Number(t.balance))
        .filter((b) => !Number.isNaN(b))
        .slice(-1)[0] ?? null;

    const spentAbs = Math.abs(out);

    return {
      totalNetFlow: net,
      totalOutflow: out,
      totalInflow: inn,
      latestBalance: latest,
      totalSpentAbs: spentAbs,
    };
  }, [transactions]);

  // Stat cards for the top of the dashboard
  const stats = useMemo(() => {
    const currency = (n) =>
      new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(n);

    const list = [];

    list.push({
      label: "Net Flow (All Time)",
      value: currency(totalNetFlow),
      sub:
        totalNetFlow >= 0
          ? "You’ve brought in more than you’ve spent overall."
          : "Spending has been higher than income overall.",
    });

    list.push({
      label: "Total Inflow",
      value: currency(totalInflow),
      sub: "All positive transactions in your uploads.",
    });

    list.push({
      label: "Total Outflow",
      value: currency(Math.abs(totalOutflow)),
      sub: "All spending across all categories.",
    });

    if (latestBalance != null) {
      list.push({
        label: "Latest Balance (From File)",
        value: currency(latestBalance),
        sub: "Based on the last line of your uploaded statements.",
      });
    } else if (profile && (profile.monthly_budget || profile.monthlyBudget)) {
      const budgetVal =
        Number(profile.monthly_budget ?? profile.monthlyBudget) || 0;
      list.push({
        label: "Monthly Budget (Quiz)",
        value: currency(budgetVal),
        sub: "From your onboarding quiz answers.",
      });
    }

    return list;
  }, [totalNetFlow, totalInflow, totalOutflow, latestBalance, profile]);

  // Category breakdown (for pie chart)
  const categoryPieData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const map = {};
    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (amt >= 0) return; // focus on spending only
      const cat = t.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + Math.abs(amt);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Month-to-month net trend
  const monthlyTrendData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const byMonth = {};
    transactions.forEach((t) => {
      const rawDate = t.transaction_date || t.date;
      if (!rawDate) return;
      const d = new Date(rawDate);
      if (Number.isNaN(d.getTime())) return;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      byMonth[ym] = (byMonth[ym] || 0) + (Number(t.amount) || 0);
    });
    const sorted = Object.entries(byMonth).sort(
      ([a], [b]) => new Date(a + "-01") - new Date(b + "-01")
    );
    return sorted.map(([ym, total]) => ({
      month: ym,
      total,
    }));
  }, [transactions]);

  // Budget vs actual (uses quiz budget + actual total outflow)
  const budgetVsActualData = useMemo(() => {
    if (!profile) return [];
    const normalized = normalizeProfile(profile);
    const budget = normalized.budget;
    if (!budget) return [];
    return [
      {
        name: "This Period",
        Budget: budget,
        Spent: totalSpentAbs,
      },
    ];
  }, [profile, totalSpentAbs]);

  // Savings projection based on quiz + spending
  const savingsProjectionData = useMemo(() => {
    const normalized = normalizeProfile(profile || {});
    if (!normalized.income && !normalized.savingsGoal) return [];
    const monthlySavings =
      normalized.savingsGoal ||
      Math.max(0, normalized.income - (normalized.budget || totalSpentAbs));
    if (!monthlySavings) return [];
    const months = 6;
    const rows = [];
    let cumulative = 0;
    for (let i = 1; i <= months; i += 1) {
      cumulative += monthlySavings;
      rows.push({
        month: `Month ${i}`,
        Saved: cumulative,
      });
    }
    return rows;
  }, [profile, totalSpentAbs]);

  const chartKeys = getDashboardCharts(personaType);
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className="bw-container space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Hi, {firstName}!{" "}
            <span className="text-sm align-middle text-[var(--color-text-muted)]">
              Welcome back to your dashboard.
            </span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Your view is tailored to your current spending style.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--color-border)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            Persona: {getPersonaLabel(personaType)}
          </span>
        </div>
      </header>

      <StatSummary stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Persona onboarding prompt */}
          {chartKeys.includes("onboardingPlaceholder") && (
            <div className="bw-card p-6 flex flex-col items-start gap-3">
              <h2 className="text-lg font-semibold">
                Get a smarter dashboard in 2 minutes
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Take the quick onboarding quiz so BudgetWise can tailor charts
                and insights to your situation.
              </p>
              <a href="/quiz" className="bw-btn bw-btn-primary mt-2">
                Start the Quiz
              </a>
            </div>
          )}

          {/* Category breakdown pie chart */}
          {hasTransactions && chartKeys.includes("categoryPie") && (
            <div className="bw-card p-4 h-80">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">
                  Where Your Money Is Going
                </h2>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Last uploaded statements · by category
                </p>
              </div>
              {categoryPieData.length === 0 ? (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Not enough spending data yet to show this chart.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="80%"
                      paddingAngle={3}
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(value)
                      }
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{
                        fontSize: "10px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {/* Month-to-month trend line */}
          {hasTransactions && chartKeys.includes("monthlyTrend") && (
            <div className="bw-card p-4 h-80">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Spending Over Time</h2>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Net total per month (income minus spending)
                </p>
              </div>
              {monthlyTrendData.length === 0 ? (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Not enough history yet to show a trend.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(value)
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Net Flow"
                      stroke={CHART_COLORS[0]}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {/* Budget vs actual bar chart */}
          {chartKeys.includes("budgetVsActual") &&
            budgetVsActualData.length > 0 && (
              <div className="bw-card p-4 h-64">
                <div className="flex items-container justify-between mb-2">
                  <h2 className="text-sm font-semibold">
                    Budget vs. Actual Spending
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    Uses your quiz budget vs. total spending in uploaded
                    statements.
                  </p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetVsActualData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(value)
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar
                      dataKey="Budget"
                      fill={CHART_COLORS[2]}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Spent"
                      fill={CHART_COLORS[1]}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

          {/* Savings projection line chart */}
          {chartKeys.includes("savingsProjection") &&
            savingsProjectionData.length > 0 && (
              <div className="bw-card p-4 h-64">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold">
                    Savings Projection
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    Based on your quiz answers about income, budget, and savings
                    goals.
                  </p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(value)
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="Saved"
                      name="Projected Savings"
                      stroke={CHART_COLORS[3]}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
        </div>

        {/* Right column: resources + recent transactions */}
        <div className="space-y-6">
          <PersonalizedForYouPanel />
          <div className="bw-card p-4">
            <h2 className="text-sm font-semibold mb-2">
              Recent Transactions
            </h2>
            {txLoading ? (
              <p className="text-xs text-[var(--color-text-muted)]">
                Loading transactions...
              </p>
            ) : !hasTransactions ? (
              <p className="text-xs text-[var(--color-text-muted)]">
                No transactions yet. Upload a statement to see more here.
              </p>
            ) : (
              <Table
                columns={[
                  { key: "transaction_date", label: "Date" },
                  { key: "description", label: "Description" },
                  { key: "category", label: "Category" },
                  { key: "amount", label: "Amount" },
                ]}
                rows={transactions.slice(0, 8)}
                emptyText="No transactions"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}