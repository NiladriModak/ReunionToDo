const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { urlencoded } = require("express");
const connectDB = require("./middlewares/connectDB");
const app = express();
const errorMiddleware = require("./middlewares/error");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
dotenv.config();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:5173", "https://reunion-to-do-beta.vercel.app"],
  credentials: true,
};
app.use(cors(corsOptions));
app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server running at port", process.env.PORT);
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRoutes);
app.use(errorMiddleware);
