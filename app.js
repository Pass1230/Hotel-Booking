var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override");
	
var	Hotel = require("./models/hotel"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

var HotelRoute = require("./routes/hotels.js"),
	CommentRoute = require("./routes/comments.js"),
	IndexRoute = require("./routes/index.js");

mongoose.connect("mongodb+srv://Yu:Aa1051164697@cluster0-mqu4f.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});

mongoose.set('useFindAndModify', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
seedDB();


// Passport Configuration
app.use(require("express-session")({
	secret: "Once again",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

app.use("/hotels", HotelRoute);
app.use("/hotels/:id/comments", CommentRoute);
app.use("/", IndexRoute)

app.listen(3000, function(){
	console.log("The Hotel-Booking Server Has Started!")
})