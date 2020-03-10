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

router.get('/:comment_id/edit', checkOwnerShip, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) throw err;
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    })
});

router.put('/:comment_id', checkOwnerShip, (req, res) =>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComments) => {
        if (err) throw err;
        res.redirect('/campgrounds/' + req.params.id);
    })
});
router.delete('/:comment_id', checkOwnerShip, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) throw err
        res.redirect('/campgrounds/' + req.params.id);
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

function checkOwnerShip(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) throw err;
            if (foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                res.redirect('back');
            }
        })
    }else{
        res.redirect('/login');
    }
}

module.exports = router;
