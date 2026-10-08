
import transporter from "./Nodemailer.js";

const SendEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: `"My Store" <${process.env.Google_Email}>`,
      to: user.email,
      subject: "Welcome to My Store 🚀",

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: #080b12;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 45px 15px;
      background:
        radial-gradient(circle at 20% 10%, #243b6b 0%, transparent 30%),
        radial-gradient(circle at 85% 90%, #3b1765 0%, transparent 30%),
        #080b12;
    }

    .container {
      max-width: 620px;
      margin: auto;
      background: #111827;
      border: 1px solid #273449;
      border-radius: 24px;
      overflow: hidden;
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.55),
        0 0 40px rgba(99, 102, 241, 0.12);
    }

    .hero {
      position: relative;
      padding: 55px 30px 45px;
      text-align: center;
      background:
        linear-gradient(135deg, #111827, #1e1b4b);
      overflow: hidden;
    }

    .glow {
      width: 180px;
      height: 180px;
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      background: #6366f1;
      border-radius: 50%;
      filter: blur(70px);
      opacity: 0.35;
    }

    .logo {
      position: relative;
      width: 72px;
      height: 72px;
      margin: 0 auto 22px;
      border-radius: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      box-shadow: 0 0 35px rgba(99, 102, 241, 0.45);
      line-height: 72px;
      font-size: 32px;
    }

    .hero h1 {
      position: relative;
      margin: 0;
      color: #ffffff;
      font-size: 32px;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }

    .hero p {
      position: relative;
      margin: 14px 0 0;
      color: #a5b4fc;
      font-size: 15px;
    }

    .content {
      padding: 38px 35px;
      background: #111827;
    }

    .hello {
      margin: 0 0 12px;
      color: #ffffff;
      font-size: 24px;
    }

    .description {
      margin: 0;
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.8;
    }

    .account-card {
      margin-top: 28px;
      padding: 22px;
      border-radius: 16px;
      border: 1px solid #293548;
      background: linear-gradient(
        135deg,
        rgba(31, 41, 55, 0.95),
        rgba(17, 24, 39, 0.95)
      );
    }

    .account-title {
      margin: 0 0 16px;
      color: #a5b4fc;
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .info-row {
      padding: 10px 0;
      border-bottom: 1px solid #273244;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #6b7280;
      font-size: 12px;
      display: block;
      margin-bottom: 4px;
    }

    .value {
      color: #ffffff;
      font-size: 15px;
      word-break: break-word;
    }

    .success {
      margin-top: 25px;
      padding: 16px;
      border-radius: 12px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #6ee7b7;
      font-size: 14px;
      line-height: 1.6;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0 12px;
    }

    .button {
      display: inline-block;
      padding: 15px 28px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
    }

    .security {
      margin-top: 30px;
      padding: 18px;
      border-radius: 12px;
      background: #0b1120;
      border: 1px solid #1f2937;
    }

    .security-title {
      margin: 0 0 7px;
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
    }

    .security-text {
      margin: 0;
      color: #6b7280;
      font-size: 12px;
      line-height: 1.7;
    }

    .footer {
      padding: 25px;
      text-align: center;
      background: #0b1120;
      border-top: 1px solid #1f2937;
    }

    .footer-brand {
      margin: 0 0 8px;
      color: #ffffff;
      font-size: 15px;
      font-weight: bold;
    }

    .footer-text {
      margin: 0;
      color: #6b7280;
      font-size: 11px;
      line-height: 1.6;
    }

    /* Supported email clients may render this */
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.35;
      }

      50% {
        transform: scale(1.15);
        opacity: 0.55;
      }
    }

    .glow {
      animation: pulse 4s ease-in-out infinite;
    }

    @media only screen and (max-width: 600px) {
      .wrapper {
        padding: 20px 10px;
      }

      .hero {
        padding: 40px 20px;
      }

      .hero h1 {
        font-size: 26px;
      }

      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      <!-- HERO -->
      <div class="hero">

        <div class="glow"></div>

        <div class="logo">
          🛍️
        </div>

        <h1>Welcome to My Store</h1>

        <p>Your account is ready. Let's get started.</p>

      </div>

      <!-- CONTENT -->
      <div class="content">

        <h2 class="hello">
          Hi ${user.name} 👋
        </h2>

        <p class="description">
          Your account has been successfully created.
          We're excited to have you as part of our community.
        </p>

        <!-- ACCOUNT INFORMATION -->
        <div class="account-card">

          <p class="account-title">
            Account Information
          </p>

          <div class="info-row">
            <span class="label">NAME</span>
            <span class="value">${user.name}</span>
          </div>

          <div class="info-row">
            <span class="label">EMAIL</span>
            <span class="value">${user.email}</span>
          </div>

        </div>

        <!-- SUCCESS MESSAGE -->
        <div class="success">
          ✓ Your account has been successfully registered and is ready to use.
        </div>

        <!-- BUTTON -->
        <div class="button-wrapper">

          <a
            href="http://localhost:3000"
            class="button"
          >
            Explore My Store →
          </a>

        </div>

        <!-- SECURITY -->
        <div class="security">

          <p class="security-title">
            🔐 Didn't create this account?
          </p>

          <p class="security-text">
            If you didn't register for My Store, please contact our
            support team immediately and secure your email account.
          </p>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="footer">

        <p class="footer-brand">
          My Store
        </p>

        <p class="footer-text">
          This is an automated message. Please do not reply directly
          to this email.
          <br><br>
          © 2026 My Store. All rights reserved.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
      `,
    });

    console.log(`Welcome email sent to ${user.email} ✅`);

  } catch (error) {
    console.error("Error sending welcome email:", error.message);
  }
};

export default SendEmail;
