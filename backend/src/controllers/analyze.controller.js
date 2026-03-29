const { cloneRepo, deleteRepo } = require("../services/git.service");
const simpleGit = require("simple-git");
const { calculateMetrics } = require("../services/metricsService");
const { calculateBurnout } = require("../services/burnoutservice");
const dayjs = require("dayjs");

// Overall request timeout (60 seconds)
const REQUEST_TIMEOUT_MS = 60_000;

exports.analyzeRepo = async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({
      error: "Repository URL is required",
    });
  }

  let repoPath;

  // Abort controller for timeout
  const abortController = new AbortController();
  const timer = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    // Check if already aborted
    if (abortController.signal.aborted) throw new Error("Request timed out.");

    // Clone repo
    repoPath = await cloneRepo(repoUrl);

    if (abortController.signal.aborted) throw new Error("Request timed out.");

    // Use simple-git with a per-operation timeout
    const git = simpleGit(repoPath, { timeout: { block: 20000 } });

    const log = await git.log({ maxCount: 500 });

    // Extract commits
    const commits = log.all.map((commit) => ({
      author: commit.author_name,
      message: commit.message.toLowerCase(),
      date: dayjs(commit.date),
    }));

    // Calculate metrics
    const metrics = calculateMetrics(commits);

    // Cleanup
    deleteRepo(repoPath);
    clearTimeout(timer);

    res.json(metrics);
  } catch (error) {
    clearTimeout(timer);

    if (repoPath) {
      deleteRepo(repoPath);
    }

    const isTimeout =
      abortController.signal.aborted ||
      (error.message && error.message.includes("timed out"));

    res.status(isTimeout ? 504 : 400).json({
      error: isTimeout
        ? "Analysis timed out. The repository may be too large."
        : error.message,
    });
  }
};

// ── Separate burnout endpoint ──────────────────────────────────────
exports.burnoutRepo = async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required" });
  }

  let repoPath;
  const abortController = new AbortController();
  const timer = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    if (abortController.signal.aborted) throw new Error("Request timed out.");

    repoPath = await cloneRepo(repoUrl);

    if (abortController.signal.aborted) throw new Error("Request timed out.");

    const git = simpleGit(repoPath, { timeout: { block: 20000 } });
    const log = await git.log({ maxCount: 500 });

    const commits = log.all.map((commit) => ({
      author: commit.author_name,
      message: commit.message.toLowerCase(),
      date: dayjs(commit.date),
    }));

    const burnout = calculateBurnout(commits);

    deleteRepo(repoPath);
    clearTimeout(timer);

    res.json(burnout);
  } catch (error) {
    clearTimeout(timer);
    if (repoPath) deleteRepo(repoPath);

    const isTimeout =
      abortController.signal.aborted ||
      (error.message && error.message.includes("timed out"));

    res.status(isTimeout ? 504 : 400).json({
      error: isTimeout
        ? "Analysis timed out. The repository may be too large."
        : error.message,
    });
  }
};