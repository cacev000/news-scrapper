var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require models that contain schema
var db = require("./models");

var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrappedNews", { useNewUrlParser: true });

// Route to scrap a website
app.get("/scrape", function (req, res) {
    axios.get("http://www.mtv.com/news/genre/pop/").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".post-header").each(function (i, element) {
            var result = {};
            result.title = $(this)
                .children("h1")
                .text();
            result.subHead = $(this)
                .children("p")
                .text();
            result.link = $(this)
                .find(".post")
                .attr("href");

            // Create Article
            db.News.create(result)
                .then(function (dbArticle) {
                    res.send(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    db.News.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// delete a comment
app.delete("/delete/:id", function (req, res) {
    db.Comments.findByIdAndRemove(req.params.id, (err, todo) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Comment has been deleted",
            id: todo._id
        };
        return res.status(200).send(response);
    })
});

// Route to get article by id and then display with note(s)
app.get("/articles/:id", function (req, res) {
    db.News.findOne({ _id: req.params.id })
        .populate('note')
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route to get comments by id
app.get("/comments/:id", function (req, res) {
    db.News.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            console.log("db" + dbArticle);
            db.Comments.find({ _id: dbArticle })
                .then(function (data) {
                    res.json(data);
                });
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route to save/update article(s)
app.post("/articles/:id", function (req, res) {
    db.Comments.create(req.body)
        .then(function (dbNote) {
            db.News.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
                .then(function (data) {
                    res.json(data);
                });
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});