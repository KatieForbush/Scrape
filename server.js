// Dependencies
// var express = require("express");
// var mongoose = require("mongoose");
// var cheerio = require("cheerio");
// var axios = require("axios");
// var request = require("request");

// //require all models
// var db = require("./models");

// var PORT = 3000;

// //initialize express
// var app = express();

// //configure middleware

// //parse request body as JSON
// app.use(express.urlencoded({ extended: true}));
// app.use(express.json());
// //make public a static folder
// app.use(express.static("public"));

// //connect to the mongo DB
// mongoose.connect("mongodb://localhost/Scrape", {
//     useNewUrlParser: true
// });

// //routes

// //GET rout for scraping the onions website

// app.get("/scrape", function(req, res){
//     //first, grab the body of the html with axios
//     axios.get("https://www.theonion.com/").then(function(response){
//         //then, load that into cheerio and save it to $ for a shorthand selector
//         var $ = cheerio.load(response.data);
//         //now, grab ever h2 within an article tag, and do the following
//         $("sc-17uq8ex-0 jYKwNu").each(function(i, element){
//             //saveing in an empty result object
//             // var result = {};

//             //add the text and href of every link, and save them as prperties of the result object
//             var result = result.title =$(this)
//                 .children("js_post_item cs4lnv-0 hczWlQ")
//                 .text();
//             result.link = $(this)
//                 .find("a")
//                 .attr("href");

//                 // //create a new article using the 'result' object built from scraping
//                 // db.article.create(result)
//                 // .then(function(dbarticle){
//                 //     //view the added result in the console
//                 //     console.log(dbarticle);
//                 // })
//                 // .catch(function(err){
//                 //     //if an error happens, log it
//                 //     console.log(err);
//                 // });
//                 console.log(result);

//         });
//         res.send("scrape complete");
//     });
// });

// // request("https://www.theonion.com/", (error, response, html) => {
// //     if(!error && response.statusCode == 200){
// //         const $ = cheerio.load(html);
        
// //         $(".data-commerce-source").each((i, el) => {
// //             const title = $(el)
// //                 .find("h1")
// //                 .text()
// //                 .replace(/\s\s+/g, "");
// //             const link = $(el)
// //                 .find("a")
// //                 .attr("href");

// //                 console.log(title)
// //         });

//         // const output = wrapper.children("data-kala").text();
        
//         // console.log(output);
// //     }
// // })

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrape", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.theonion.com").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var element = {};
//I want to get the title and article from theonion.com
      // Add the text and href of every link, and save them as properties of the result object
      element.title = $(this)
        .children()
        .text();
      element.link = $(this)
        .children("a")
        .attr("href");
        
        console.log(element);
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
