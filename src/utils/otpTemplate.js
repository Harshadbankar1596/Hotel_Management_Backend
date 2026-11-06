const otpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:30px;background:#f4f4f5;font-family:Arial,sans-serif;">
        <div style="max-width:450px;margin:auto;background:white;padding:30px;border-radius:10px;">
          <h2 style="color:#991b1b;">Hotel Management</h2>
          <h3>Email Verification</h3>
          <p>Your verification OTP is:</p>

          <div style="padding:15px;background:#fef2f2;text-align:center;border-radius:8px;">
            <h1 style="letter-spacing:10px;color:#991b1b;">${otp}</h1>
          </div>

          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p style="color:#777;font-size:12px;">
            Please do not share this OTP with anyone.
          </p>
        </div>
      </body>
    </html>
  `;
};

export default otpTemplate;