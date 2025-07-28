import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./email-template.js";
import { mailtrapClient, sender } from "./mailtrap-config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email Address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification"
        })

        //console.log("Verification email sent successfully:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}

export const sendWelcomeEmail = async (email, username) => {
    try {
        const recipient = [{ email }];
        await mailtrapClient
            .send({
                from: sender,
                to: recipient,
                template_uuid: "49779bc5-6a3c-4198-86df-8f8c0e53c3fb",
                template_variables: {
                    "name": username
                }
            });
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const recipient = [{ email }];
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Request",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
}

export const sendPasswordResetSuccessEmail = async (email) => {
    try {
        const recipient = [{ email }];
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success"
        });
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email");
    }
}