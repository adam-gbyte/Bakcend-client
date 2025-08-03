require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");

const ImageKit = require("./config/imageKit");

const tourRoutes = require("./routes/tourRoutes");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/tours", tourRoutes);

app.get("/api/auth/image-kit", (req, res) => {
  const authParameters = ImageKit.getAuthenticationParameters();
  console.log("ImageKit authentication parameters:", authParameters);
  res.send(authParameters);
});

app.use(router.get("/", (req, res) => {
  res.send("API is running...");
}))

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
