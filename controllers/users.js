const User=require("../models/user");

module.exports.renderSignUpForm=(req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WandorLust");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};

module.exports.RenderLoginForm=(req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login=async (req, res) => {//it is use to authenticate the user is already exist or not, password matching or not
    req.flash("success", "welcome back to WanderLust! You are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/listings")
    })
}
