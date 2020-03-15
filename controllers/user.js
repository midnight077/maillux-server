const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyJWT } = require("../utils");

exports.createUser = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  console.log(req.body);
  const passwordHash = bcrypt.hashSync(req.body.password, 8);
  try {
    const newUser = await User.create({
      email,
      username,
      password: passwordHash
    });
    if (newUser) {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.json({ auth: true, token });
    }
  } catch (err) {
    res.json({ error: true, reason: "email already exists" });
    throw err;
  }
};

exports.getUser = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    User.findById(decodedRes.id)
      .populate("courses")
      .exec((err, data) => {
        if (err) res.json(err);
        else res.json(data);
      });
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const foundUser = await User.find({ email }).select("+password");
  if (foundUser.length <= 0)
    res.json({ error: true, reason: "invalid username or password" });
  else if (foundUser.length > 0) {
    const match = await bcrypt.compare(
      req.body.password,
      foundUser[0].password
    );
    if (match) {
      const token = jwt.sign({ id: foundUser[0]._id }, process.env.JWT_SECRET);
      res.json({ auth: true, token });
    } else {
      res.json({ error: true, reason: "invalid username or password " });
    }
  }
};
