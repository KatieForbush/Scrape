// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

//require all models
var db = require("./models");

var PORT = 3000;

//initialize express
var app = express();

//configure middleware

//parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
//make public a static folder
app.use(express.static("public"));

//connect to the mongo DB
mongoose.connect("mongodb://localhost/Scrape", {
    useNewUrlParser: true
});
