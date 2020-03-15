const Course = require("../models/Course");
const User = require("../models/User");
const { verifyJWT } = require("../utils");
exports.getCourses = async (req, res, next) => {
  try {
    let courses = await Course.find();
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
        .filter((item) => !item.isPublished)
        .map((item) => {
          return {
            title: item.title,
            author: item.author,
            duration: item.duration,
            subscribers: item.subscribers.length,
            description: item.description,
            createdAt: item.createdAt,
            _id: item._id
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.addCourse = async (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  console.log(decodedRes);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const fetchedUser = await User.findById(decodedRes.id);
      console.log(fetchedUser);
      const course = await Course.create({
        ...req.body.content,
        author: fetchedUser.username
      });
      console.log(course);
      fetchedUser.courses.push(course);
      fetchedUser.save();
      return res.status(201).json({
        success: true,
        data: course
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
};

exports.publishCourse = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      course.isPublished = true;
      course.save();
      return res.status(201).json({
        success: true,
        data: course
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
};
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const data = { ...course._doc };
    data.isFirstSave = undefined;
    data.content = undefined;
    data.isPublished = undefined;
    data.subscribers = data.subscribers.length;
    return res.status(201).json({
      success: true,
      data
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.editMaterial = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      course.content[req.body.day - 1].material = req.body.material;
      course.content[req.body.day - 1].title = req.body.title;
      course.markModified("content");
      const i = await course.save();
      console.log(i.content);
      return res.status(201).json({
        success: true,
        data: i
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
};
