const nodeMailer = require('nodemailer');

const { nodeMailerConfig, chsClientUrl } = require('../config');

module.exports = {
    sendVerificationEmail: async(user) => {
        try {
            const transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: nodeMailerConfig.email,
                    pass: nodeMailerConfig.password,
                },
            });

            const mailOptions = {
                from: nodeMailerConfig.email,
                to: user.email,
                subject: "Verify your email",
                html: `
                    <b>Dear ${user.name},</b>
                    <br/><br/>
                    <a href="${chsClientUrl}/Verify?token=${user.verificationCode}">
                    Click</a> here to verify your email.
                    <br/><br/>
                    Regards,
                    <br/>
                    The CHS Team`,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    },

    sendSignupUserMail: async(name, email) => {
        try {
            const transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: nodeMailerConfig.email,
                    pass: nodeMailerConfig.password,
                },
            });

            const mailOptions = {
                from: nodeMailerConfig.email,
                to: email,
                subject: "Complete the signup",
                html: `
                    <b>Dear ${name},</b>
                    <br/><br/>
                    Complete your profile!
                    <br/>
                    <a href="${chsClientUrl}/Registration?name=${name}?email=${email}">
                    Click</a> here to complete your profile and sign up.
                    <br/><br/>
                    Regards,
                    <br/>
                    The CHS Team`,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    },

    sendForgotPasswordEmail: async(user) => {
        try {
            const transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: nodeMailerConfig.email,
                    pass: nodeMailerConfig.password,
                },
            });

            const mailOptions = {
                from: nodeMailerConfig.email,
                to: user.email,
                subject: "Forgot Password",
                html: `
                    <b>Dear ${user.name},</b>
                    <br/><br/>
                    Reset Your Password!
                    <br/>
                    <a href="${chsClientUrl}/Reset?token=${user.recoverToken}">
                    Click</a> here to change your password.
                    <br/>
                    If you didn’t mean to reset your password, then you can just ignore this email,
                    your password will not change.
                    <br/><br/>
                    Regards,
                    <br/>
                    The CHS Team`,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    },
};
