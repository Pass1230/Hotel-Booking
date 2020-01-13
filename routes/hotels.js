var express = require("express");
var router = express.Router();
var Hotel = require("../models/hotel");
var User = require("../models/user");

router.get("/", function(req, res){
	Hotel.find({}, function(err, hotel){
		if (err){
			console.log(err);
		} else {
			res.render("hotels/index", {hotels: hotel});
		}
	})
})

router.get("/new", isLoggedIn, function(req, res){
	res.render("hotels/new");
})

router.get("/:id", function(req, res){
	Hotel.findById(req.params.id).populate("comments").exec(function(err, findHotel){
		if(err){
			console.log(err);
		} else {
			res.render("hotels/show", {hotel: findHotel});
		}
	})
})

router.post("/", function(req, res){
	var name = req.body.Name;
	var image = req.body.Image;
	var description = req.body.Description;
	var author = {id: req.user._id, username: req.user.username};
	var newHotel = {name: name, image: image, description: description, author: author};
	Hotel.create(newHotel, function(err, newcreated){
		if (err){
			console.log(err);
		} else{
			res.redirect("/hotels");
		}
	})
})

router.delete("/:id", isLoggedIn, function(req, res){
	Hotel.findByIdAndRemove(req.params.id, function(err){
		if (err){
			res.redirect("/hotels");
		} else {
			res.redirect("/hotels");
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
	if (req.isAuthenticated()) {
		Hotel.findById(req.params.id, function(err, hotel){
			if (err){
				res.redirect("back");
			} else {
				console.log(req.params.id);
				if (hotel.author.id.equals(hotel.author.id)){
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