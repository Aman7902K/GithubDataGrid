import axios from "axios";

// Base URL is configurable via Vite env, with a sensible local default.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const client = axios.create({ baseURL });

export async function fetchRepos() {
  const { data } = await client.get("/repos");
  return Array.isArray(data) ? data : [];
}

export async function importRepos(token) {
  const { data } = await client.post("/repos", { token });
  return data;
}

export async function deleteRepos(ids) {
  const { data } = await client.delete("/repos", { data: { ids } });
  return data;
}
