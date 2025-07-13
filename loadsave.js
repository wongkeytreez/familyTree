// LoadSave.js
let token = "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";
let owner = "wongkeytreez"
let repo = "familyTree"
let path = "familyTree.json"
// ===== GITHUB SAVE & LOAD =====

// Save tree to GitHub (requires token)
async function saveToGitHub(content, message = "Update file") {
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  let sha = null;

  // Step 1: Check if the file exists (to get the sha)
  const checkRes = await fetch(apiURL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json"
    }
  });

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    sha = checkData.sha; // needed for updates
  } else if (checkRes.status !== 404) {
    const err = await checkRes.json();
    console.error("GitHub check error:", err);
    throw new Error("Failed to check file existence");
  }

  // Step 2: Create or update file
  const res = await fetch(apiURL, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      ...(sha ? { sha } : {}) // include sha only if updating
    })
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("GitHub error:", result);
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return result;
}

// Load tree from GitHub
async function loadFromGitHub(callback) {
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(apiURL, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw"
    }
  });

  if (!res.ok) {
    alert("❌ Failed to load from GitHub.");
    console.error(await res.json());
    return;
  }

  try {
    const json = await res.json();
    callback(json);
  } catch (err) {
    try {
      // Try as raw file
      const raw = await res.text();
      callback(JSON.parse(raw));
    } catch (err2) {
      alert("❌ Invalid JSON format.");
      console.error(err2);
    }
  }
}
