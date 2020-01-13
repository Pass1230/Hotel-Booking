var mongoose = require("mongoose"),
	Hotel = require("./models/hotel"),
	Comment = require("./models/comment");

var data = [
	{
		name: "Drury Inn & Suites Champaign",
		image: "https://r-cf.bstatic.com/images/hotel/max1024x768/901/90118892.jpg",
		description: "Extra-person charges may apply and vary depending on property policy. Special requests cannot be guaranteed. Please note that cultural norms and guest policies may differ by country and by property. The policies listed are provided by the property."
	},
	{
		name: "I Hotel And Conference Center",
		image: "https://images.trvl-media.com/hotels/2000000/1080000/1077200/1077161/a0b2c5bc_z.jpg",
		description: "Extra-person charges may apply and vary depending on property policy. Special requests are subject to availability upon check-in and may incur additional charges. Special requests cannot be guaranteed."
	},
	{
		name: "La Quinta Inn by Wyndham",
		image: "https://photos.bringfido.com/ein/3/4/0/123043/76519_664285_z.jpg?size=tile&density=2x",
		description: "Extra-person charges may apply and vary depending on property policy. Special requests are subject to availability upon check-in and may incur additional charges. Special requests cannot be guaranteed."
	}
]

function seedDB(){
	// Remove all hotels
	Hotel.remove({}, function(err){
	if(err){
		console.log(err);
	} 
		console.log("removed hotel!");
	
		// Add a few hotels
		data.forEach(function(seed){
			Hotel.create(seed, function(err, hotel){
				if (err){
					console.log(err);
				} else {
					console.log("added a hotel");
					
					// Creat a comment
					Comment.create(
						{
						text: "We never had problems using this place. Though mynkids couldn't use the pool due to construction, service was nice and location is very convenient.",
						author: "Jodie",
						}, function(err, comment){
							if (err) {
								console.log(err);
							} else {
								hotel.comments.push(comment);
								hotel.save();
								console.log("Created a new comment!")
							}							
						})
				}
			})
	})
	})	
}

module.exports = seedDB;