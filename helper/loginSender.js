
import transporter from "./Nodemailer.js";

const LoginEmail = async (user) => {
  try {
    const loginTime = new Date().toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    await transporter.sendMail({
      from: `"My Store Security" <${process.env.Google_Email}>`,
      to: user.email,
      subject: "🔐 New Login to Your My Store Account",

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
      background: #070b14;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 45px 15px;
      background:
        radial-gradient(circle at 15% 10%, #17345f 0%, transparent 30%),
        radial-gradient(circle at 90% 90%, #35145a 0%, transparent 30%),
        #070b14;
    }

    .container {
      max-width: 620px;
      margin: auto;
      overflow: hidden;
      border-radius: 24px;
      background: #111827;
      border: 1px solid #263449;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
    }

    .hero {
      padding: 45px 30px;
      text-align: center;
      background: linear-gradient(135deg, #111827, #172554);
    }

    .icon {
      width: 76px;
      height: 76px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      box-shadow: 0 0 35px rgba(59, 130, 246, 0.4);
      line-height: 76px;
      font-size: 34px;
    }

    .hero h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
    }

    .hero p {
      margin: 12px 0 0;
      color: #93c5fd;
      font-size: 14px;
    }

    .content {
      padding: 38px 35px;
    }

    .hello {
      margin: 0 0 12px;
      color: #ffffff;
      font-size: 23px;
    }

    .description {
      margin: 0;
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.8;
    }

    .alert {
      margin: 28px 0;
      padding: 18px;
      border-radius: 14px;
      background: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.25);
    }

    .alert-title {
      margin: 0 0 7px;
      color: #93c5fd;
      font-size: 14px;
      font-weight: bold;
    }

    .alert-text {
      margin: 0;
      color: #9ca3af;
      font-size: 13px;
      line-height: 1.6;
    }

    .details {
      margin-top: 25px;
      padding: 20px;
      border-radius: 15px;
      background: #0b1120;
      border: 1px solid #1f2937;
    }

    .details-title {
      margin: 0 0 15px;
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
    }

    .row {
      padding: 11px 0;
      border-bottom: 1px solid #1f2937;
    }

    .row:last-child {
      border-bottom: none;
    }

    .label {
      display: block;
      margin-bottom: 5px;
      color: #6b7280;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.7px;
    }

    .value {
      color: #e5e7eb;
      font-size: 14px;
      word-break: break-word;
    }

    .security {
      margin-top: 28px;
      padding: 18px;
      border-radius: 14px;
      background: rgba(239, 68, 68, 0.07);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .security-title {
      margin: 0 0 8px;
      color: #fca5a5;
      font-size: 14px;
      font-weight: bold;
    }

    .security-text {
      margin: 0;
      color: #9ca3af;
      font-size: 13px;
      line-height: 1.7;
    }

    .footer {
      padding: 24px;
      text-align: center;
      background: #0b1120;
      border-top: 1px solid #1f2937;
    }

    .footer-brand {
      margin: 0 0 7px;
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

    @media only screen and (max-width: 600px) {
      .wrapper {
        padding: 20px 10px;
      }

      .content {
        padding: 30px 20px;
      }

      .hero {
        padding: 38px 20px;
      }

      .hero h1 {
        font-size: 24px;
      }
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      <!-- HEADER -->
      <div class="hero">

        <div class="icon">
          🔐
        </div>

        <h1>New Login Detected</h1>

        <p>Your My Store account was just accessed</p>

      </div>

      <!-- CONTENT -->
      <div class="content">

        <h2 class="hello">
          Hi ${user.name} 👋
        </h2>

        <p class="description">
          We detected a successful login to your My Store account.
          This is a security notification to help keep your account safe.
        </p>

        <!-- ALERT -->
        <div class="alert">

          <p class="alert-title">
             Login Successful
          </p>

          <p class="alert-text">
            Your email and password were successfully verified and
            your account was login.
          </p>

        </div>

        <!-- LOGIN DETAILS -->
        <div class="details">

          <p class="details-title">
            Login Details
          </p>

          <div class="row">
            <span class="label">Account</span>
            <span class="value">${user.email}</span>
          </div>

          <div class="row">
            <span class="label">Login Time</span>
            <span class="value">${loginTime}</span>
          </div>

          <div class="row">
            <span class="label">Status</span>
            <span class="value">Successful</span>
          </div>

        </div>

        <!-- SECURITY WARNING -->
        <div class="security">

          <p class="security-title">
            ⚠️ Wasn't you?
          </p>

          <p class="security-text">
            If you didn't log in to your account, someone may have
            access to your credentials. Change your password immediately
            and secure your account.
          </p>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="footer">

        <p class="footer-brand">
          My Store Security
        </p>

        <p class="footer-text">
          This is an automated security notification.
          Please do not reply directly to this email.
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

    console.log(`Login security email sent to ${user.email} ✅`);

  } catch (error) {
    console.error("Error sending login email:", error.message);
  }
};

export default LoginEmail;
