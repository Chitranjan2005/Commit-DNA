const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "../../temp-repos");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Generate unique folder name
function generateFolderName() {
  return "repo-" + Date.now();
}

// Clone repository with a 30-second timeout
exports.cloneRepo = async (repoUrl) => {
  const folderName = generateFolderName();
  const repoPath = path.join(TEMP_DIR, folderName);

  // simple-git instance with a 30s timeout on every git operation
  const git = simpleGit({ timeout: { block: 30000 } });

  try {
    const env = {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
      GCM_INTERACTIVE: "false",
      GIT_ASKPASS: "echo",
    };

    await git.env(env).clone(repoUrl, repoPath, [
      "--bare",
      "--depth", "500",          // shallow clone — 500 commits is plenty
      "--filter=blob:none",      // skip downloading file blobs
      "--single-branch",         // only the default branch
      "-c", "core.askPass=echo",
      "-c", "credential.helper=",
    ]);
    return repoPath;
  } catch (error) {
    // Clean up partial clone if it exists
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
    if (error.message && error.message.includes("timed out")) {
      throw new Error("Repository clone timed out. The repo may be too large or the network is slow.");
    }
    throw new Error("Failed to clone repository. It may be private or invalid.");
  }
};

// Delete repository folder
exports.deleteRepo = (repoPath) => {
  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }
};