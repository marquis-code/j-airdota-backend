const express = require("express");
const app = express();
const morgan = require("morgan");
const helment = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const connectDB = require("./config/db.config");

connectDB();

// middleware
const corsOptions = {
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helment());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable('x-powered-by');

const authRouter = require("./routes/auth.routes");
const publicationRouter = require("./routes/publication.routes");
const subscriptionRouter = require("./routes/subscription.routes");
const memberRouter = require("./routes/member.routes");
const eventRouter = require("./routes/event.routes");
const enquiryRouter = require("./routes/enquiry.routes");

// map URL starts:
app.use("/api/auth", authRouter);
app.use("/api/publication", publicationRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/member", memberRouter);
app.use("/api/event", eventRouter);
app.use("/api/enquiry", enquiryRouter);

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});


module.exports = app;
