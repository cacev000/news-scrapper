var mongoose = require("mongoose");

// Create structor that will be used to create object
var Schema = mongoose.Schema;

// Create Object for Comments
var CommentsSchema = new Schema({
    title: String,
    body: String,
});

var Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;