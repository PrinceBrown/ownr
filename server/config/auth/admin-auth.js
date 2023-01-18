module.exports = {
  ensureAuthenticated(req, res, next) {

    console.log('ensureAuthenticated',)
    if (req.isAuthenticated()) {
      return next();
    }
    // req.flash('error_msg', ' Please login to view this resource');
    return res.status('301').redirect('/admin/login');
  },
};
