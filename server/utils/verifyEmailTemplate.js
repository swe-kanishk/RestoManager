const verifyEmailTemplate = ({ fullName, otp }) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                }
                .container {
                    max-width: 500px;
                    background: #fff;
                    padding: 20px;
                    dispaly: flex;
                    align-items: center;
                    justify-items: center;
                    margin: 0 auto;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .button {
                    display: inline-block;
                    text-decoration: none;
                    color: white;
                    background-color: orange;
                    padding: 12px 24px;
                    margin-top: 20px;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Dear ${fullName},</h2>
                <p>Thank you for registering with ClickMart.</p>
                <p>Please use the OTP below to verify your email address.</p>
                <span>${otp}</span>
                <p>If you did not register, you can ignore this email.</p>
                <p>Best regards,<br><strong>ClickMart Team</strong></p>
            </div>
        </body>
        </html>
    `;
};

export default verifyEmailTemplate;