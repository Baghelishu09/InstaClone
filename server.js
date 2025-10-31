// server.js
require('dotenv').config();
const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 80;


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace <username> and <password> with your Atlas credentials
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("insta_clone"); // your database name
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}
connectDB();

// Route to store user input
app.post("/storeUser", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  try {
    await db.collection("users").insertOne({ username, password, createdAt: new Date() });
    console.log("📦 Data saved:", username, password);
    res.json({message:"✅ User data saved successfully!"});
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ message: "Error saving data" });
  }
});

app.listen(port, () => console.log("🚀 Server running on http://localhost:3000"));
