// =========================================================
// Diff-aware facts writing - shared by sync-bill and sync-all.
// =========================================================
// syncedAt changes on every run, so two versions are compared
// WITHOUT it and a file is rewritten only when something real
// moved. This is what lets the nightly job say "nothing changed,
// nothing committed" and mean it: a quiet night leaves the git
// working tree spotless.
import { readFile, writeFile } from "node:fs/promises";

export async function writeIfChanged(path, content) {
  const stripSyncedAt = (s) => s.replace(/^\s*syncedAt: ".*",?$/m, "");
  try {
    const existing = await readFile(path, "utf8");
    if (stripSyncedAt(existing) === stripSyncedAt(content)) return "unchanged";
  } catch {
    // New file - fall through and write it.
  }
  await writeFile(path, content, "utf8");
  return "written";
}
