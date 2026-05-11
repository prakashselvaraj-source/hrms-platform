package com.hrm.hrm_saas.common.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String to, String companyName, String subdomain) {
        try {

            System.out.println("Sending welcome email to " + to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Welcome to " + companyName);

            String htmlContent = """
                        <div style="font-family: Arial; padding: 20px;">
                            <h2>Welcome to %s 🎉</h2>
                            <p>Your company has been successfully created.</p>

                            <p><strong>Company:</strong> %s</p>
                            <p><strong>Login URL:</strong> http://%s.localhost:3000</p>

                            <br/>

                            <a href="http://%s.localhost:3000"
                               style="background-color:#4CAF50;color:white;
                               padding:10px 20px;text-decoration:none;border-radius:5px;">
                               Login to Dashboard
                            </a>

                            <br/><br/>
                            <p>Thanks,<br/>HRM SaaS Team</p>
                        </div>
                    """.formatted(companyName, companyName, subdomain, subdomain);

            helper.setText(htmlContent, true);

            mailSender.send(message);

            System.out.println("Email sent successfully ✅");

        } catch (Exception e) {
            e.printStackTrace(); // VERY IMPORTANT
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);

            System.out.println("Attempting to send email to " + to + "...");
            mailSender.send(message);
            System.out.println("Email sent successfully to " + to + " ✅");
        } catch (Exception e) {
            System.out.println("CRITICAL EMAIL FAILURE: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }
}