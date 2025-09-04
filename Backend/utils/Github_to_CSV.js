import dotenv from "dotenv";

dotenv.config();

export default async function listAllPrivateRepos() {
  const base = "https://api.github.com/user/repos?visibility=all&per_page=100";
  const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` };
  let url = base;

  const all = [];

  while (url) {
    const res = await fetch(url, { headers });
    const page = await res.json();

    all.push(
      ...page.map((repo) => [
        repo.name,
        repo.clone_url,
        repo.updated_at,
        repo.owner.login,
        repo.language,
      ])
    );

    const link = res.headers.get("Link");
    const next = link && link.split(",").find((p) => p.includes('rel="next"'));
    url = next ? next.split(";")[0].trim().slice(1, -1) : null;
  }

  return all; 
}
