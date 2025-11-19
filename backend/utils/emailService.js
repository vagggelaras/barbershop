import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(appointmentData) {
    try {
        const { customerEmail, customerName, service, barber, date, time } = appointmentData;

        const { data, error } = await resend.emails.send({
            from: 'ZEN Hair & Beauty Spa <onboarding@resend.dev>', // Change this after domain verification
            to: [customerEmail],
            subject: 'Appointment Confirmation - ZEN Hair & Beauty Spa',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .header p {
                            margin: 5px 0 0 0;
                            color: #ff6b35;
                            font-size: 14px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .appointment-details {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        .detail-row {
                            display: flex;
                            padding: 12px 0;
                            border-bottom: 1px solid #eee;
                        }
                        .detail-row:last-child {
                            border-bottom: none;
                        }
                        .detail-label {
                            font-weight: bold;
                            width: 120px;
                            color: #555;
                        }
                        .detail-value {
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            color: #777;
                            font-size: 14px;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background: linear-gradient(135deg, #776262 0%, #675252 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            margin: 20px 0;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>ZEN</h1>
                        <p>Hair and Beauty Spa</p>
                    </div>

                    <div class="content">
                        <h2>Hello ${customerName}! 👋</h2>
                        <p>Your appointment has been confirmed. We look forward to seeing you!</p>

                        <div class="appointment-details">
                            <h3 style="margin-top: 0; color: #1a1a1a;">Appointment Details</h3>

                            <div class="detail-row">
                                <div class="detail-label">Service:</div>
                                <div class="detail-value">${service}</div>
                            </div>

                            <div class="detail-row">
                                <div class="detail-label">Barber:</div>
                                <div class="detail-value">${barber}</div>
                            </div>

                            <div class="detail-row">
                                <div class="detail-label">Date:</div>
                                <div class="detail-value">${new Date(date).toLocaleDateString('el-GR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</div>
                            </div>

                            <div class="detail-row">
                                <div class="detail-label">Time:</div>
                                <div class="detail-value">${time}</div>
                            </div>
                        </div>

                        <p style="margin-top: 20px;">
                            <strong>Important:</strong> Please arrive 5 minutes before your appointment time.
                        </p>

                        <p>
                            If you need to cancel or reschedule, please contact us as soon as possible.
                        </p>

                        <div class="footer">
                            <p>Thank you for choosing ZEN Hair & Beauty Spa!</p>
                            <p>Questions? Contact us at info@zenhairspa.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }

        console.log('Email sent successfully:', data);
        return { success: true, data };

    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send appointment cancellation email
 */
export async function sendAppointmentCancellation(appointmentData) {
    try {
        const { customerEmail, customerName, service, date, time } = appointmentData;

        const { data, error } = await resend.emails.send({
            from: 'ZEN Hair & Beauty Spa <onboarding@resend.dev>',
            to: [customerEmail],
            subject: 'Appointment Cancelled - ZEN Hair & Beauty Spa',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>ZEN</h1>
                        <p style="color: #ff6b35; text-transform: uppercase; letter-spacing: 2px;">Hair and Beauty Spa</p>
                    </div>

                    <div class="content">
                        <h2>Appointment Cancelled</h2>
                        <p>Hello ${customerName},</p>
                        <p>Your appointment for <strong>${service}</strong> on <strong>${new Date(date).toLocaleDateString('el-GR')}</strong> at <strong>${time}</strong> has been cancelled.</p>
                        <p>We hope to see you again soon! You can book a new appointment anytime on our website.</p>
                        <p style="margin-top: 30px; text-align: center; color: #777;">
                            Thank you,<br>
                            ZEN Hair & Beauty Spa Team
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }

        return { success: true, data };

    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error: error.message };
    }
}
