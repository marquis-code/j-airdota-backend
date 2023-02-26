const express = require("express");
const app = express();
const morgan = require("morgan");
const helment = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const { requireAuth, checkUser } = require("./middleware/auth.middleware");
dotenv.config();

const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db.cofig");

connectDB();

// middleware
const corsOptions = {
  // origin:'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helment());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");

// map URL starts:
app.get("*", checkUser);
app.use("/api/auth", authRouter);
app.use("/api/admin", requireAuth, adminRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;
