const   express = require('express'),
        router  = express.Router();

const   Campground  =   require('../../models/campgrounds');
//=========================
// ROUTES
//=========================

router.get('/campgrounds', (req, res) =>{
    Campground.find({}, (err, allCampgrounds) =>{
        if (err) throw err;
        res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
    })
});
router.get('/campgrounds/new', isLoggedIn, (req, res) =>{
    res.render('campgrounds/new');
});
// SHOW    /posts/:id  GET     Show info of the post
router.get('/campgrounds/:id', (req, res) =>{
    //find provide ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) throw err;       
        res.render('campgrounds/singleCampground', {campground: foundCampground});
    });
});
// POST
router.post('/campgrounds', (req, res) =>{
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({
        name: req.body.name, 
        image: req.body.image,
        description: req.body.description,
        author: author, 
        }, function(err, campground) {
            if(err) throw err;
            res.redirect('/campgrounds');
        }
    )
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
module.exports = router;