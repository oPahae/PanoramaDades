import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const { fullName, email, enquiry } = req.body;

  if (!fullName || !email || !enquiry) {
    return res.status(400).json({ status: "failed", message: "Missing data" });
  }

  if (req.method === 'POST') {
    const transporter = nodemailer.createTransport({
      host: process.env.OVH_SMTP,
      port: 587,
      secure: false,
      auth: {
        user: process.env.OVH_SMTP_USER,
        pass: process.env.OVH_SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      await transporter.verify();

      await transporter.sendMail({
        from: `"Panorama Dades Website" <${process.env.OVH_SENDER}>`,
        to: 'contact@panoramadades.com',
        subject: `New Enquiry from ${fullName}`,
        replyTo: email,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>New Enquiry</title>
          </head>
          <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
              <tr>
                <td align="center">
                  
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background:#003366; padding:25px; text-align:center;">
                        <h2 style="color:#ffffff; margin:0;">New Contact Enquiry</h2>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding:30px;">
                        
                        <p style="font-size:15px; color:#555;">
                          You have received a new message from your website contact form.
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                          
                          <tr>
                            <td style="padding:12px 0; font-weight:bold; color:#003366;">
                              Full Name:
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:15px; color:#333;">
                              ${fullName}
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:12px 0; font-weight:bold; color:#003366;">
                              Email Address:
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:15px; color:#333;">
                              ${email}
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:12px 0; font-weight:bold; color:#003366;">
                              Message:
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:20px; color:#333; line-height:1.6; background:#f9fafc; padding:15px; border-radius:6px;">
                              ${enquiry.replace(/\n/g, "<br>")}
                            </td>
                          </tr>

                        </table>

                        <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

                        <p style="font-size:13px; color:#888;">
                          Sent on: ${new Date().toLocaleString()}
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f4f6f9; padding:20px; text-align:center; font-size:12px; color:#999;">
                        © ${new Date().getFullYear()} Panorama Dades — All rights reserved.
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `,
      });

      return res.status(200).json({ message: 'Email sent!' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}