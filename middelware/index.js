//All the middleware goes here
const   Campground  =   require('../models/campgrounds'),
        Comment     =   require('../models/comments');

const middlewareObj = {};

middlewareObj.checkCampOwnerShip = (req, res, next) => {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, foundCampground) => {
                if (err) throw err;

                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            });
        } else {
            res.redirect('/login');
        }
    };

middlewareObj.checkCommentsOwnerShip = (req, res, next) => {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) throw err;
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            })
        } else {
            res.redirect('/login');
        }
    };

middlewareObj.isLoggedIn = (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
            res.redirect('/login');
    };

module.exports = middlewareObj;