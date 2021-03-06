const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        flash           = require('connect-flash'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        methodOverride  = require('method-override'),

        //models
        User        = require('./models/users'),
        seedDB      = require('./models/seeds');

        //routes
const   commentRoutes   =   require('./views/routes/comments'),
        campgroundRoutes=   require('./views/routes/campgrounds'),
        indexRoutes     =   require('./views/routes/index');

//seedDB();
// ==============================================================================================
// RESTFUL ROUTERS
// name      url       verb    desc.
// ====================================================
// INDEX   /campgrounds      GET     Display all campgrounds
// NEW     /campgrounds/new  GET     Display form to make a new campgrounds
// CREATE  /campgrounds      POST    Add new campgrounds
// SHOW    /campgrounds/:id  GET     Show info of the campgrounds
// ==============================================================================================


// DATABASE CONFIG
//const url = 'mongodb://localhost:27017/data';
const url = 'mongodb+srv://yelpcamp:yelpcamp@cluster0-v6xpx.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url,  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function(err, client){
    if (err) throw err;
    console.log("DB connected");
});

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'Hello this is Jesus but not from the sky, from spain',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// APP CONFIG
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error    = req.flash('error');
    res.locals.success  = req.flash('success');
    next();
});
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


// SERVER LISTEN
app.listen(process.env.PORT, function(){
    console.log("Server has started!");
})