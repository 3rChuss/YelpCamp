const   express = require('express'),
        router  = express.Router({mergeParams:true});

const   Campground  =   require('../../models/campgrounds'),
        Comment     =   require('../../models/comments');
const   middleware  =   require('../../middelware/index');
        
//============================
// COMMENTS ROUTES
//============================

router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) throw err;
        res.render('comments/new', {campground: campground});
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
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
            req.flash('success','Comment successfully added!');
            res.redirect('/campgrounds/'+campground._id);
        });
    });
});

router.get('/:comment_id/edit', middleware.isLoggedIn, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) throw err;
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    })
});

router.put('/:comment_id', middleware.checkCommentsOwnerShip, (req, res) =>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComments) => {
        if (err) throw err;
        req.flash('success', 'The comment has been updated successfully!');
        res.redirect('/campgrounds/' + req.params.id);
    })
});
router.delete('/:comment_id', middleware.checkCommentsOwnerShip, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) throw err;
        req.flash('error', 'The comment has been deleted!');
        res.redirect('/campgrounds/' + req.params.id);
    })
})


module.exports = router;
