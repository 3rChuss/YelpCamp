const   express = require('express'),
        router  = express.Router();

const       Campground  =   require('../../models/campgrounds'),
            middleware  =   require('../../middelware');
           
//=========================
// ROUTES
//========================= 
router.get('/', (req, res) =>{
    Campground.find({}, (err, allCampgrounds) => {
        if (err) throw err;
        res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
    })
});
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
// SHOW    /posts/:id  GET     Show info of the post
router.get('/:id', (req, res) =>{
    //find provide ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) throw err;       
        res.render('campgrounds/singleCampground', {campground: foundCampground});
    });
});
// POST
router.post('/', (req, res) =>{
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
            req.flash('success', 'Campground successfully added!');
            res.redirect('/campgrounds');
        }
    )
});

router.get('/:id/edit', middleware.checkCampOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

router.put('/:id', middleware.checkCampOwnerShip, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) throw err;
        res.redirect('/campgrounds/' + req.params.id);
    })
});
router.delete('/:id', middleware.checkCampOwnerShip, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) throw err;
        req.flash('error', 'Campground deleted!');
        res.redirect('/campgrounds');
    });
});


module.exports = router;