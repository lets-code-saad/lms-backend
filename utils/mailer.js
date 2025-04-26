const nodemailer = require("nodemailer")
require("dotenv").config()

const sendResetMail = async ({to,subject,otp}) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
        to,
        from: "Saad Edemy",
        subject,
        text: `Your OTP Is ${otp}`
})

}

module.exports = sendResetMail