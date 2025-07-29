async function fetchGitHubProfile(username, token = null) {
  const headers = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  // 1. Profilo utente
  const userResp = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (!userResp.ok) throw new Error("User fetch failed");
  const user = await userResp.json();
  // 2. Repos ordinati per stelle
  const repoResp = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`, { headers });
  if (!repoResp.ok) throw new Error("Repos fetch failed");
  const repos = await repoResp.json();

  // 3. Somma totale delle stelle
  const totalStars = repos.reduce((sum,r) => sum + (r.stargazers_count || 0), 0);

  // 4. Costruzione della stringa
  const lines = [];
  lines.push(`🔸 Nome: ${user.login} (${user.name || ""})`);
  lines.push(`🔸 Profilo: ${user.html_url}`);
  lines.push(`🔸 Followers: ${user.followers}`);
  lines.push(`🔸 Repos mostrati: ${repos.length} (prime 5 per stelle)`);
  lines.push(`🔸 ⭐ Totale stelle (parziale): ${totalStars}`);
  lines.push("");
  lines.push("⭐ Top repositories:");
  repos.forEach(r => {
    const stars = "★".repeat(Math.min(5, Math.round(r.stargazers_count/10))) + ` (${r.stargazers_count})`;
    lines.push(` • ${r.name}: ${stars} — ${r.html_url}`);
  });

  return lines.join("\n");
}
