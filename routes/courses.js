const express = require("express");
const {
  getCourses,
  addCourse,
  publishCourse,
  getCourse,
  editMaterial,
  editTitle,
  addDay,
  deleteCourse,
  deleteDay,
  editDescription,
  toggleWrap
} = require("../controllers/courses");
const {
  getSubscribers,
  addSubscriber,
  verifySubscriber
} = require("../controllers/subscribers");
const router = express.Router();

router
  .route("/")
  .get(getCourses)
  .post(addCourse);

router
  .route("/:courseId/")
  .get(getCourse)
  .post(publishCourse)
  .put(editMaterial)
  .delete(deleteCourse);

router
  .route("/:courseId/day")
  .post(addDay)
  .put(deleteDay);

router.route("/:courseId/title").put(editTitle);
router.route("/:courseId/description").put(editDescription);
router.route("/:courseId/day/togglewrap").post(toggleWrap);
router
  .route("/:courseId/subscribers")
  .get(getSubscribers)
  .post(addSubscriber);

router
  .route("/:courseId/subscribers/:subscriberId/verify")
  .get(verifySubscriber);

module.exports = router;
