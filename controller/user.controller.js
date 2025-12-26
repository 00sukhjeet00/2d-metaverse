const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const trimmedUsername = username?.trim();
  const trimmedEmail = email?.trim().toLowerCase();

  if (!trimmedUsername || !trimmedEmail || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
  });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: trimmedUsername,
    email: trimmedEmail,
    password: hashedPassword,
  });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, username, avatar: user.avatar } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.trim().toLowerCase() });

  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      position: user.position,
    },
  });
});
