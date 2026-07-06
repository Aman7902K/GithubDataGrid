import Repo from "../models/repos.models.js";

const getRepoData = async (req, res) => {
  try {
    const repos = await Repo.find({});
    res.json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

const setRepoData = async (req, res) => {
  const { token } = req.body;

  try {
    const listAllPrivateRepos = (await import("../utils/Github_to_CSV.js"))
      .default;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    console.log("GitHub token received, fetching repositories...");

    const allRepos = await listAllPrivateRepos(token);

    if (!allRepos || allRepos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No repositories found",
      });
    }

    // Transform data for MongoDB insertion.
    // GitHub repo tuple: [name, clone_url, updated_at, owner.login, language]
    const repoDocuments = allRepos.map((repo) => ({
      name: repo[0],
      url: repo[1],
      githubUpdatedAt: repo[2] || null,
      owner: repo[3],
      lang: repo[4],
    }));

    // Bulk insert. Duplicate keys (repos already imported) are expected on a
    // re-import, so with { ordered: false } we count the docs that did insert
    // instead of failing the whole request.
    let insertedCount;
    try {
      const result = await Repo.insertMany(repoDocuments, { ordered: false });
      insertedCount = result.length;
    } catch (err) {
      if (Array.isArray(err?.insertedDocs)) {
        insertedCount = err.insertedDocs.length;
      } else {
        throw err;
      }
    }

    console.log("Number of records inserted: " + insertedCount);
    res.json({
      success: true,
      message: `Imported ${insertedCount} new repositories`,
      recordsInserted: insertedCount,
    });
  } catch (error) {
    console.error("Error processing token:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process token and fetch repositories",
    });
  }
};

const deleteRepoData = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided" });
    }

    const result = await Repo.deleteMany({ _id: { $in: ids } });

    console.log("Number of records deleted: " + result.deletedCount);
    res.json({
      success: true,
      message: result.deletedCount + " deleted successfully!",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting repositories:", error);
    res.status(500).json({ error: "Failed to delete repositories" });
  }
};

export { getRepoData, setRepoData, deleteRepoData };
