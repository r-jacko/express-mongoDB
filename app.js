// 0DvrOxoZc7VLgdEq
// mongodb+srv://admin:0DvrOxoZc7VLgdEq@cluster0.wspgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// bibliotek do błędów http
var createError = require("http-errors");
// przechowywanie sesji na podstawie cookie przez określony czas po zalogowaniu
var cookieSession = require("cookie-session");
var express = require("express");
// do pobierania public
var path = require("path");
var cookieParser = require("cookie-parser");
// zrzucanie logów w trybie dev
var logger = require("morgan");

// config do cookies
var config = require("./config");

// baza danych i łączenie
var mongoose = require("mongoose");
mongoose.connect(config.db, { useNewUrlParser: true });

// test połączenia
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
// db.once('open',function(){
//   console.log('db connect');
// })

// importy routingów
var indexRouter = require("./routes/index");
var newsRouter = require("./routes/news");
var quizRouter = require("./routes/quiz");
var adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware
app.use(logger("dev"));
app.use(express.json());
// parsowanie formularzy np.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// deklaracja katalogu statycznego
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieSession({
    name: "session",
    keys: config.keySession,
    // cookie options
    maxAge: config.maxAgeSession,
  })
);

// funkcja która będzie routem, będzie pobierała z requesta aktualny adres strony i go będziemy przekazywać do każdego naszego widoku, żeby puścić skrypt dalej wykorzystamy metode next. Jeżeli będę na /news najpierw wykona się ten routing a dzięki next przejdzie do zadeklarowanego routingu

app.use(function (req, res, next) {
  res.locals.path = req.path; //dzięki temu będzie globalnie dostępny w szablonach

  next();
});

// deklaracja routingów
app.use("/", indexRouter);
app.use("/news", newsRouter);
app.use("/quiz", quizRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
// wyłapywanie adresów które nie istnieją za pomocą błędów z biblioteki http errors
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
