export const isLogedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in to create a listing!");
      return res.redirect("/login");
    }
    next();
}