const Course = require("../../models/Course");
const { postmail } = require("./postmail");
exports.routineMail = async () => {
  try {
    const courses = await Course.find({ isPublished: false });
    courses.forEach((course) => {
      let obj = {};
      course.subscribers.forEach((sub) => {
        if (sub.position in obj) {
          obj[sub.position].push(sub.email);
        } else {
          obj[sub.position] = [sub.email];
        }
      });
      Object.keys(obj).forEach(async (pos) => {
        if (pos <= course.duration) {
          const mailId = obj[pos][0];
          obj[pos].shift();
          const bcc = obj[pos].join("");
          const subject = `Maillux : Day ${pos} ${course.title} | ${
            course.content[pos - 1].title
          }`;
          const content = course.content[pos - 1].material;
          try {
            const info = await postmail(mailId, subject, content, bcc);
            const sent = info.accepted;
            const c = await Course.findById(course._id);
            for (let i = 0; i < c.subscribers.length; i++) {
              if (sent.includes(c.subscribers[i].email)) {
                c.subscribers[i].position += 1;
              }
            }
            c.markModified("subscribers");
            const saved = await c.save();
          } catch (error) {
            console.log(error);
          }
        }
      });
    });
    return "done";
  } catch (err) {
    console.log(err);
  }
};
