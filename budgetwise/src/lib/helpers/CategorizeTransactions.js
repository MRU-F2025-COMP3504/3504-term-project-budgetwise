import { CATEGORY_KEYWORDS } from "./CalgarySpendingCategories";

/**
 * Assign a category based on keywords found in the transaction description.
 * @param {string} description
 * @returns {string} category name
 */
export function categorizeTransaction(description = '') {
  if (!description) return 'Other / Transfers';

  const desc = description.toLowerCase();

  // Check each category
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (desc.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return 'Other / Transfers';
}
