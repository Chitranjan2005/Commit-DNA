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

// Clone repository
exports.cloneRepo = async (repoUrl) => {
  const folderName = generateFolderName();
  const repoPath = path.join(TEMP_DIR, folderName);

  const git = simpleGit();

  try {
    const env = {
        ...process.env,
        GIT_TERMINAL_PROMPT: '0',
        GCM_INTERACTIVE: 'false',
        GIT_ASKPASS: 'echo'
    };
    
    await git.env(env).clone(repoUrl, repoPath, [
        "--bare",
        "--depth", "5000",
        "--filter=blob:none",
        "-c", "core.askPass=echo",
        "-c", "credential.helper="
    ]);
    return repoPath;
  } catch (error) {
    throw new Error("Failed to clone repository. It may be private or invalid.");
  }
};

// Delete repository folder
exports.deleteRepo = (repoPath) => {
  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }
};