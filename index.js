var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var http = require("http").Server(app);
var socketio = require("socket.io")(http);

var mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/grocery_db", () => {
    console.log('Your App is connected to mongo db')
}).catch(function() {
    console.log("Not Connected to Database ERROR!");
});

var Item = mongoose.model("Item", {
    item: String
});

app.get("/items", (req, res) => {
    Item.find({}, (err, allItems) => {
        res.send(allItems);
    });
});
app.post("/items", (req, res) => {
    var item = new Item(req.body);
    item.save((err) => {
        if (err) {
            sendStatus(500);
            console.log(err)
        } else {
            socketio.emit("broadcast", req.body);
            res.sendStatus(200);
        }
    });
});

socketio.on("connection", socket => {
    console.log("Roomate Connected");
})
var server = http.listen(3000, () => {
    console.log(`Server running at http://localhost:${server.address().port}`);
});