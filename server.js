const express = require("express");
const app = express();
const morgan = require("morgan");
const helment = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
// const { requireAuth, checkUser } = require("./middleware/auth.middleware");
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
const productRouter = require("./routes/product.route");
const supportRouter = require("./routes/support.routes");
const subscriptionRouter = require("./routes/subscription.routes");
const memberRouter = require("./routes/member.routes");

const eventRouter = require("./routes/event.routes");
const memberPurchaseRouter = require("./routes/memberPurchase.routes");
const newsRoomRouter = require("./routes/newsRoom.routes");

// map URL starts:
// app.get("*", checkUser);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

app.use("/api/support", supportRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/member", memberRouter);

app.use("/api/event", eventRouter);
app.use("/api/member-purchase", memberPurchaseRouter);
app.use("/api/news-room", newsRoomRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
