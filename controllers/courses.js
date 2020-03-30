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
        .filter((item) => item.isPublished)
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
      res.status(500).json({ err });
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
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      if (!course.isPublished)
        course.content.forEach((day) => {
          if (!day.material) throw "first fill the content for each day.";
        });
      course.isPublished = !course.isPublished;
      course.save();
      return res.status(201).json({
        success: true,
        data: course
      });
    } catch (err) {
      res.status(200).json({ err });
    }
  }
};
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const data = { ...course._doc, titles: [] };
    data.isFirstSave = undefined;
    data.content.forEach((day) => data.titles.push(day.title));
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

exports.editDescription = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      course.description = req.body.description;
      course.markModified("description");
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

exports.editMaterial = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
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

exports.editTitle = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  console.log(decodedRes);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      course.title = req.body.title;
      course.markModified("title");
      const i = await course.save();
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

exports.addDay = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  console.log(decodedRes);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      course.content.push({ title: "", material: "" });
      course.duration = course.content.length;
      course.isPublished = false;
      course.markModified("content");
      const i = await course.save();
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

exports.toggleWrap = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  console.log(decodedRes);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      course.content[req.body.day - 1].wrap = !course.content[req.body.day - 1]
        .wrap;
      course.markModified("content");
      const i = await course.save();
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

exports.deleteDay = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      if (course.subscribers.length)
        throw "You can only delete a day if the course have zero subscribers";
      course.content.splice(req.body.day - 1, 1);
      course.markModified("content");

      course.duration = course.content.length;
      course.markModified("duration");
      const i = await course.save();
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

exports.deleteCourse = async (req, res) => {
  const token = req.headers["x-access-token"];
  let decodedRes = await verifyJWT(token);
  if (decodedRes.error) res.json(decodedRes);
  else {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) throw "This course is not available";
      const fetchedUser = await User.findById(decodedRes.id);
      if (fetchedUser.username != course.author)
        throw "Only author can perform this operation";
      fetchedUser.courses.splice(fetchedUser.courses.indexOf(course._id), 1);
      await fetchedUser.save();
      await Course.findByIdAndRemove(req.params.courseId);

      return res.status(201).json({
        success: true,
        data: "done"
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
};
