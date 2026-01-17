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

    // Transform data for MongoDB insertion
    const repoDocuments = allRepos.map((repo) => ({
      name: repo[0],
      url: repo[1],
      owner: repo[3],
      lang: repo[4],
    }));

    // Insert into MongoDB using insertMany (bulk insert)
    const result = await Repo.insertMany(repoDocuments, { ordered: false });

    console.log("Number of records inserted: " + result.length);
    res.json({
      success: true,
      message: "Token received and repositories inserted successfully",
      recordsInserted: result.length,
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
