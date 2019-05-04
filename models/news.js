var mongoose = require("mongoose");

// Saving schema constructor into mongoose
var Schema = mongoose.Schema;

// Create schema object
var NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subHead: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]
});

var News = mongoose.model("News", NewsSchema);

module.exports = News;