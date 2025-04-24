const nodemailer = require("nodemailer")
require("dotenv").config()

const sendResetMail = async ({to,subject}) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
        to,
        from: process.env.USER_EMAIL,
        subject,
})

}

module.exports = sendResetMail