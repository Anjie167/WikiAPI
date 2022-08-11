const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { get } = require("http");
const _ = require("lodash");


const app = express();

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema = mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
});

const Article = mongoose.model("article", articlesSchema);

app.route("/articles")

.get(function(req,res) {
    Article.find(function(err, foundArticles){
        if(err){
            res.send(err);
        }else{
            res.send(foundArticles);
        }
        
    });
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }
    });

    console.log(req.body.title);
    console.log(req.body.content);
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        }
    });
});


app.route("/articles/:title")

.get(function(req, res){
    Article.find({title: req.params.title}, function(err, data){
        if(!err){
            res.send(data);
        }
    });
})

.put(function(req, res){
    Article.updateOne({title: req.params.title}, {title: req.body.title, content: req.body.content}, function(err){
        if(!err){
            res.send({
                error: false,
                message: "Successfully updated article"
            });
        }else{
            console.log(err);
        }
    });
})

.delete(
    function(req, res){
        Article.deleteOne({title: req.params.title},function(err){
            if(!err){
                res.send({
                    error: false,
                    message: "Successfully Deleted article"
                });
            }else{
                console.log(err);
            }
        });
    }
);

app.listen(3000, function(){
    console.log("server started on port 3000");
});

