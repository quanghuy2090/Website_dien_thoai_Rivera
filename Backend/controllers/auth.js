const User = require("../models/user");
exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], picture }, // Thay đổi từ user.email -> email
    { new: true }
  );
  if (user) {
    console.log("user updated", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0], // Thay đổi từ user.email -> email
      picture,
    }).save();
    console.log("create user", newUser);
    res.json(newUser);
  }
};
exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};
