const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { v4: uuidv4 } = require('uuid');
const { exec } = require("child_process");
const multer = require("multer");
const fs = require("fs");
const moveFile = require("move-file");
const getSize = require('get-folder-size');

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
  name: String,
  username: String,
  password: String,
  storage: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './storage');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

var upload = multer({storage: storage});

app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/s");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.get("/s", function(req, res) {
  if (req.isAuthenticated()) {
    const userStorageFolder = "./storage/" + req.user.storage + "/";
    fs.readdir(userStorageFolder, function(err, files) {
      if (!err)
      {
        getSize(userStorageFolder, function(err, size) {
          res.render("storage", {name: req.user.name, username: req.user.username, fileLength: files.length, fileNames: files, size: size});
        });
      }
    });
  }
  else {
    res.redirect("/");
  }
});

app.post("/upload", upload.single("file"), function(req, res) {
  (async () => {
    await moveFile(__dirname + "/storage/" + req.file.filename, __dirname + "/storage/" + req.user.storage + "/" + req.file.filename);
    return res.status(200).send({result: 'redirect', url:'/s'})
  })();
});

app.post("/delete", function(req, res) {
  if (req.isAuthenticated()) {
    const userStorageFolder = "./storage/" + req.user.storage + "/";
    fs.unlink(userStorageFolder + req.body.filename, function(err) {
      return res.status(200).send({result: 'redirect', url:'/s'})
    });
  }
  else {
    res.redirect("/");
  }
});

app.post("/register", function(req, res) {
  uuid = uuidv4();
  User.register({name: req.body.name, username: req.body.username, storage: uuid} , req.body.password, function(err, user) {
    if (err) {
       console.log(err)
    } else {
      exec("mkdir storage/" + uuid);
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
