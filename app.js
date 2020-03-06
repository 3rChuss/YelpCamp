const   express     = require('express'),
        app         = express(),
        Campground  = require('./models/campgrounds'),
        Comment     = require('./models/comments'),
        User        = require('./models/users'),
        seedDB      = require('./models/seeds'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        url         = 'mongodb://localhost:27017/data';

//seedDB();
mongoose.connect(url,  {useNewUrlParser: true, useUnifiedTopology: true }, function(err, client){
    if (err) throw err;
    console.log("DB connected");
});


// RESTFUL ROUTERS
// name      url       verb    desc.
// ====================================================
// INDEX   /posts      GET     Display all posts
// NEW     /posts/new  GET     Display form to make a new post
// CREATE  /posts      POST    Add new post
// SHOW    /posts/:id  GET     Show info of the post

// SET
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//GET
app.get('/', (req, res) =>{
    res.render('landing');
});

app.get('/campgrounds', (req, res) =>{
    //get campsites from db
    Campground.find({}, (err, allCampgrounds) =>{
        if (err) throw err;
        res.render("index", {campgrounds: allCampgrounds});
    })
});

app.get('/campgrounds/new', (req, res) =>{
    res.render('new');
});

// SHOW    /posts/:id  GET     Show info of the post
app.get('/campgrounds/:id', (req, res) =>{
    //find provide ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) throw err;       
        res.render('singleCampground', {campground: foundCampground});
    });
});

// POST
app.post('/campgrounds', (req, res) =>{
    Campground.create({
        name: req.body.name, 
        image: req.body.image,
        description: req.body.description
        }, function(err, campground) {
            if(err) throw err;
            console.log('NEWLY CREATED');
            console.log(campground);
            res.redirect('/campgrounds');
        }
    )
});



// SERVER LISTEN
app.listen(3000, function(){
    console.log("Server has started!");
    
})