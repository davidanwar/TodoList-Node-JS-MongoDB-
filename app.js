const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); 
app.set("view engine", "ejs");
var day;

mongoose.connect("mongodb+srv://admin-david:d4v1d4nw4r@cluster0.vmyys.mongodb.net/todoListDB?retryWrites=true&w=majority", {
    //mongodb://localhost:27017/todoListDB
    useNewUrlParser: true, useUnifiedTopology: true
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome todo list item"
});

const item2 = new Item ({
    name: "Selamat Datang"
});

const item3 = new Item ({
    name: "Wilujeng Sumping"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String, 
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {
        
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items");
                }
            });

            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
        
    });

    day = date();
    
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(!foundList) {
                // create new list
                const list = new List ({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });   
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else  {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }

   
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
                console.log("Successfull removed");
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
    

});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItem});
});

app.post("/work", function(res, req) {
    let item = req.body.newItem;
    workItem.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res) {
    res.render("about");
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
    console.log("Server is running Successfully");
});