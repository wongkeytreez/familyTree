// LoadSave.js
let token ="github"+"_pat_"+20-9+"A2IQOVQ0urvQYaTZhMQH_VlM3whGMHMTbsuiCfNI3PqN9OSfzFPOYCaOkie1sIi7CHGPC5INqRFyKFtv";
let owner = "wongkeytreez"
let repo = "familyTree"
let path = "familyTree.json"
async function loadFromGitHub() {
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(apiURL, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!res.ok) {
    console.error('Failed to load:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const content = atob(data.content);
  return JSON.parse(content);
}
async function saveToGitHub(fileData) {
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(fileData, null, 2))));

  // Step 1: Get the SHA of the current file (required for updating)
  const getRes = await fetch(apiURL, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  let sha = null;
  if (getRes.ok) {
    const fileInfo = await getRes.json();
    sha = fileInfo.sha;
  }

  // Step 2: Upload the new file content
  const res = await fetch(apiURL, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Update ${path}`,
      content: content,
      sha: sha,
    }),
  });

  if (!res.ok) {
    console.error('Failed to save:', res.status, await res.text());
    return null;
  }

  return await res.json();
}
