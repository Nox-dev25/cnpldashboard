import { transporter } from "@/lib/mailer";

export async function sendKycPendingEmail(email: string, name?: string) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Your KYC is under review",
        html: `
      <div style="font-family:Arial,sans-serif;font-size:14px">
        <p>Hi ${name || "User"},</p>

        <p>Your <b>KYC has been submitted successfully</b>.</p>

        <p>Our verification team is currently reviewing your documents.</p>

        <p>This process usually takes <b>2–3 business days</b>.</p>

        <p>You will receive another email once your KYC is approved.</p>

        <br/>

        <p>Regards,<br/>Cantech Team</p>
      </div>
    `,
    });
}