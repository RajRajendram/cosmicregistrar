import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import personRoutes from "./routes/person.routes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/persons", personRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Cosmic Registrar Backend Running" });
});

app.get("/healthz", (req, res) => {
  res.json({ 
    status: "ok",
  service: "Cosmic Registrar Backend"
  });
});


//app.use(express.json());

app.post("/api/user/register", (req, res) => {
  res.json({
    message: "Register route working",
    received: req.body
  });
});

// MongoDB Connection
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cosmic_registrar";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });