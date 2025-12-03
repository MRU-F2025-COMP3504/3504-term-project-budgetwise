/**
 * Home Page Configuration
 *
 * This file contains the data for the cards and features shown on the home/dashboard page.
 * It's separated here to make it easy to change text, icons, or colors without touching the code.
 */

export const dashboardCards = [
  {
    href: "/upload",
    label: "Upload",
    icon: "↑",
    shape: "rounded",
    bgColor: "var(--buttoncolor1)",
    shadow: "rgba(91, 75, 138, 0.15)",
    description: "Upload bank statements or CSV files to track your spending",
  },
  {
    href: "/statements",
    label: "Statements",
    icon: "≡",
    shape: "rounded",
    bgColor: "var(--buttoncolor1)",
    shadow: "rgba(91, 75, 138, 0.15)",
    description: "View and manage all your uploaded statements",
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: "$",
    shape: "circle",
    bgColor: "var(--buttoncolor2)",
    shadow: "rgba(91, 75, 138, 0.15)",
    description: "Browse and categorize all your transactions",
  },
  {
    href: "/categories",
    label: "Categories",
    icon: "#",
    shape: "rounded",
    bgColor: "var(--buttoncolor3)",
    shadow: "rgba(61, 125, 107, 0.15)",
    description: "Organize spending into custom categories",
  },
  {
    href: "/budgets",
    label: "Budgets",
    icon: "%",
    shape: "rounded",
    bgColor: "var(--status-success)",
    shadow: "rgba(61, 125, 107, 0.15)",
    description: "Set spending limits and track your progress",
  },
  {
    href: "/ai",
    label: "AI Assistant",
    icon: "AI",
    shape: "circle",
    bgColor: "var(--buttoncolor1)",
    shadow: "rgba(91, 75, 138, 0.1)",
    description: "Get personalized insights and advice",
  },
];

export const featureCards = [
  {
    emoji: "📊",
    title: "Smart Categorization",
    description:
      "Automatically organize transactions into meaningful categories",
    shadow: "rgba(91, 75, 138, 0.2)",
  },
  {
    emoji: "🔒",
    title: "Privacy First",
    description:
      "Your data stays private. No bank linking, just simple uploads",
    shadow: "rgba(61, 125, 107, 0.2)",
  },
  {
    emoji: "💡",
    title: "Clear Insights",
    description: "Understand your spending patterns with visual dashboards",
    shadow: "rgba(182, 139, 60, 0.2)",
  },
];

export const quickLinks = [
  { href: "/dashboard", label: "Dashboard", variant: "primary" },
  { href: "/upload", label: "Upload Statement", variant: "accent" },
  { href: "/profile", label: "Profile Settings", variant: "neutral" },
];
