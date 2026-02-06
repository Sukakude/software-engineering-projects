import { mailtrapClient, sender } from "../mailtrap/mailtrap.config.js";
import {PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "../mailtrap/emailTemplates.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: "Email Verification" // for data analytics
        });

        console.log(`Email sent successfully: ${response}`);
    }
    catch(error){
        console.log("Error: ", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];
    try{
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            template_uuid: process.env.TEMPLATE_UUID,
            template_variables: {
                "company_info_name": process.env.COMPANY_NAME,
                "name": name
            }
        });

        console.log(`Welcome email successfully sent!`, response);
    }
    catch(error){
        console.error("Error while sending welcome email", error);
        throw new Error(`Error while sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];
    try{
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
            category: "Password Reset"
        });
    }
    catch(error){
        console.log("Error while trying to reset password: ", error);
        throw new Error("Error while trying to reset password: ", error);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Password successfully reset',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password Reset'
        });

        console.log('Password reset email sent successfully', response);
    } catch (error) {
        console.log('Error sending the password reset success email', error);
        throw new Error(`Error sending the password reset success email: ${error}`);
    }
};