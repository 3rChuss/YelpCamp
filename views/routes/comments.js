const   express = require('express'),
        router  = express.Router({mergeParams:true});

const   Campground  =   require('../../models/campgrounds'),
        Comment     =   require('../../models/comments');
//============================
// COMMENTS ROUTES
//============================

router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) throw err;
        res.render('comments/new', {campground: campground});
    });
});

router.post('/', isLoggedIn ,(req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) throw err;
        Comment.create(req.body.comment, (err, comment) => {
            if (err) throw err;
            //add the user
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/'+campground._id);
        });
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
