const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended:true }));
app.use(session({
  secret: "yosemitesecretkey",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/Yosemite", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  fullName: String,
  username: String,
  password: String,
  storage: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/s");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.get("/s", function(req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname +"/storage.html");
  }
  else {
    res.redirect("/");
  }
});

app.post("/register", function(req, res) {
  User.register({fullName: req.body.fullName, username: req.body.username, storage: "a"} , req.body.password, function(err, user) {
    if (err) {
       console.log(err)
    } else {
      passport.authenticate("local")(req, res, function() {
        return res.status(200).send({result: 'redirect', url:'/s'})
      });
    }
  });
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        return res.status(200).send({result: 'redirect', url:'/s'})
      });
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  return res.status(200).send({result: 'redirect', url:'/'})
});

app.listen(PORT);
