const { createTransport } = require("nodemailer");

const transporter = createTransport({
    service: "Gmail",
    auth: {
        username: "",
        password:""
    }
})