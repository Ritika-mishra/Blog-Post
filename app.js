//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/journal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});


const blogSchema = new mongoose.Schema({
  composedTitle: String,
  composedPost: String,
});

const Blog = mongoose.model("Blog", blogSchema);


module.exports = mongoose;




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {
  Blog.find({})
    .then((posts) => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        displayPosts: posts,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
app.post("/", function (req, res) {
  res.render("compose")
})


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
})



app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
})


app.get("/compose", function (req, res) {
  res.render("compose")
})

app.post("/compose", function (req, res) {
  const post = new Blog({
    composedTitle: req.body.composedTitle,
    composedPost: req.body.composedPost,
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
    });
});




app.get("/posts/:postName", function (req, res) {
  const requestedTitle = (req.params.postName);
  console.log("Requested Title:", requestedTitle);
  Blog.findOne({ composedTitle: requestedTitle })
    .then((post) => {
      if (post) {
        res.render("post", {
          composedTitle: post.composedTitle,
          composedPost: post.composedPost,
        });

      }

    })
    .catch((err) => {
      console.error(err);
      // Handle the error appropriately, e.g., render an error page
    });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
