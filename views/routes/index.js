const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../../models/users');

router.get('/', (req, res) =>{
    res.render('landing');
});
//=========================
// AUTH ROUTES
//=========================
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            return res.render('register', {error: err.message});
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelCamp ' + user.username);
            res.redirect('/campgrounds');
        })
    })
});

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password.'
    }), (req, res) => {
        
    }
);
router.get('/loggout', (req, res) =>{
    req.logOut();
    res.redirect('/campgrounds');
});



module.exports = router;