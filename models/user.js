var mongoose = require("mongoose");

var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/myapp1", {
    useNewUrlParser: true,
    //useUnifiedTopology: true,
});

//mongoose.set("useUnifiedTopology", true);

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    create_time: {
        type: Date,
        default: Date.now,
    },
    last_modify_time: {
        type: Date,
        default: Date.now,
    },
    gender: {
        type: Number,
        enum: [0, 1],
    },
    birthday: {
        type: Date,
    },
    status: {
        type: Number,
        // 0 cant use, 1 can use
        enum: [0, 1],
    },
});

module.exports = mongoose.model("User", userSchema);