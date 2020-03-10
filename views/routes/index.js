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
    User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{
        if(err) throw err;
        passport.authenticate('local')(req, res, () => {
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
        failureRedirect: '/login'    
    }), (req, res) => {
        
    }
);
router.get('/loggout', (req, res) =>{
    req.logOut();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


module.exports = router;