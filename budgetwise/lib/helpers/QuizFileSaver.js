// Lightweight helper to write completed quiz results to a local JSON file.
// This is useful during development or demos to inspect what the model produced.
// Note: In serverless deployments the filesystem may be ephemeral. Treat this as a dev-only tool.

import fs from "fs/promises";
import path from "path";

/**
 * Write quiz results to a timestamped JSON file under prototypes/user profiles
 * @param {{ profile: object, summary: string, history?: Array<{role:string, content:string}> }} params
 * @returns {Promise<string>} The absolute path of the written file
 */
export async function saveQuizSummaryToFile({ profile, summary, history = [] }) {
  const baseDir = path.join(process.cwd(), "prototypes", "user profiles");
  const stamp = new Date().toISOString().replace(/[:]/g, "-");
  const filename = `quiz_summary_${stamp}.json`;
  const fullPath = path.join(baseDir, filename);

  const payload = {
    savedAt: new Date().toISOString(),
    profile: profile || {},
    summary: summary || "",
    history,
  };

  await fs.mkdir(baseDir, { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(payload, null, 2), "utf8");
  return fullPath;
}
