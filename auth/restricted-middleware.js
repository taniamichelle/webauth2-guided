module.exports = (req, res, next) => {
  // console.log(req.session.user);
  // is the user logged in === do we have info about the user in our session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
};
