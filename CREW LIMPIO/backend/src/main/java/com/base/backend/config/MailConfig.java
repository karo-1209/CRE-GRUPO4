package com.base.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        // Valores por defecto para entorno de desarrollo; ajustar según necesidad
        mailSender.setHost("localhost");
        mailSender.setPort(25);
        return mailSender;
    }
}


