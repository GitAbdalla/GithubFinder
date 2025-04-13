require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get("/github-user/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({ message: data.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/github-user/:username/repos", async (req, res) => {
  const username = req.params.username;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({ message: data.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
