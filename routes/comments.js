var express = require("express");
var router = express.Router({mergeParams: true});
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");


router.get("/new", isLoggedIn, function(req, res){
	Hotel.findById(req.params.id, function(err, hotel){
		if (err){
			console.log(err);
		} else {
			res.render("comments/new", {hotel: hotel});
		}
	})
})

router.post("/", function(req, res){
	Hotel.findById(req.params.id, function(err, hotel){
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
				} else {
					
					// Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();

					// Add comment to hotel
					hotel.comments.push(comment);
					hotel.save();
					res.redirect("/hotels/" + hotel._id);
				}
			})
		}
		
	})	
})

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, comment){
		if (err){
			console.log(err);
		} else {
			console.log(req.params.id);
			res.render("comments/edit", {hotel: req.params.id, comment: comment});
		}
	})
})

// // COMMENT UPDATE
router.put("/:comment_id", checkOwnership, function(req, res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, newComment){
		if (err) {
			res.redirect("/hotels");
		} else {
			res.redirect("/hotels/" + req.params.id);
		}
	})	
})

router.delete("/:comment_id", checkOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if (err){
			console.log(err);
		} else {
			console.log(req.params.id);
			console.log(req.params.comment_id);
			res.redirect("/hotels/" + req.params.id);
		}
	})
})

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkOwnership(req, res, next){
	if (req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, comment){
			if (err){
				console.log(err);
			} else {
				console.log(req.user._id);
				console.log(comment);
				if (req.user._id.equals(comment.author.id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		})
	} else {
		res.redirect("/login");
	}
}

module.exports = router;