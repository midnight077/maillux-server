const { transporter } = require('./transporter');
exports.postmail = (mailId, subject, content, bcc) =>
    transporter.sendMail({
        from: `"Maillux" <${process.env.EMAIL_ID}>`,
        to: mailId,
        subject,
        bcc,
        html: content
    });
