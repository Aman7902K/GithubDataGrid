import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import repoRoutes from "./src/routes/repos.route.js";
import conn from "./src/db/index.js";

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Use the repo routes
app.use("/repos", repoRoutes);

app.use("/", (req, res) => {
    res.json({ error: "Route not found" });
});

conn.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database:", err);
});