const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./model/User")
const Job = require("./model/Job")

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/danapro", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Koneksi MongoDB berhasil");
});

mongoose.connection.on("error", (err) => {
  console.error("Koneksi MongoDB gagal: " + err);
});

const secretKey = "secret-key";

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

function verifyToken(req, res, next) {
    const token = req.header("Authorization");
  
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied, token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }

  app.get("/api/jobs", verifyToken, async (req, res) => {
    try {
      const { description, location, full_time, page } = req.query;
      const pageNumber = parseInt(page) || 1;
      const perPage = 10;
      const startIndex = (pageNumber - 1) * perPage;

      const searchRegex = new RegExp(description, "i");
  
      const jobs = await Job.find({
        $or: [
          { description: searchRegex },
          { location: new RegExp(location, "i") },
          { full_time: full_time === "true" },
        ],
      })
        .skip(startIndex)
        .limit(perPage);
  
      const totalJobs = await Job.countDocuments({
        $or: [
          { description: searchRegex },
          { location: new RegExp(location, "i") },
          { full_time: full_time === "true" },
        ],
      });
  
      const totalPages = Math.ceil(totalJobs / perPage);
  
      res.json({ jobs, totalPages, currentPage: pageNumber });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  app.get("/api/jobs/:id", verifyToken, async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      res.json({ success: true, job });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
