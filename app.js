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
const cors = require('cors');

const app = express();

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://yosemite-fs.azurewebsites.net');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(cors());
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

const PORT = process.env.PORT || 3000;
const URL  = process.env.MONGODB_URL || "mongodb+srv://yosemiteadmin:yosemitepassword@yosemite.6rn6p.mongodb.net/Yosemite?retryWrites=true&w=majority";

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  name: String,
  username: String,
  password: String,
  storage: String
});

const shareSchema = new mongoose.Schema ({
  path: String,
  author: String,
});

userSchema.plugin(passportLocalMongoose);

const Share = mongoose.model("Share", shareSchema);
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

app.get("/download", function(req, res) {
  const file = __dirname + "/storage/" + req.userß.storage + "/" + req.query.filename;
  res.download(file);
});

app.post("/share", function(req, res) {
  const share = new Share();
  share.path = __dirname + "/storage/" + req.user.storage + "/" + req.body.filename;
  share.author = req.user.name;
  share.save();
  res.status(200).send({url: "https://yosemite-fs.azurewebsites.net/sh/" + share._id.toString()});
});

app.get("/sh/:uid", function(req, res) {
  Share.findById(req.params.uid, function(err, share) {
    res.download(share.path);
  });
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
