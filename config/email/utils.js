const { postmail } = require("./postmail");

exports.sendVerificationSuccessfulMail = async (course, subscriber) => {
  const content = `Hey ${subscriber.name},<br/> Your email has been verified successfully, 
you have successfully subscribed to ${course.title}, <br/> You will be receiving Day 1 Course Contents Soon.<br/>Best of luck,<br>${course.author}`;
  return postmail(subscriber.email, `Maillux : ${course.title}`, content);
};

exports.sendVerificationMail = async (course, subscriber) => {
  const content = `Hey ${subscriber.name},<br/> Thanks for signing up for ${course.title} <br/> The course duration is ${course.duration} days.<br/><br/>${course.description}<br/><br/><a href="http://127.0.0.1:8800/api/courses/${course._id}/subscribers/${subscriber._id}/verify">Verify your email</a> first to get access to the course content.`;
  return postmail(subscriber.email, `Maillux : ${course.title}`, content);
};

exports.sendFirstMail = async (course, subscriber) => {
  const content = course.content[subscriber.position - 1][0].material;
  const subject = `Maillux : Day 1 ${course.title}`;
  return postmail(subscriber.email, subject, content);
};
