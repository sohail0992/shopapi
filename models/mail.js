var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

class Mail{
    constructor(){
        this.service = "";
        this.auth = {
            username: "",
            password: ""
        };
        this.from = "";
        this.to = "";
        this.subject = "";
        this.text = "";
        this.transporter;
    }

    getTransporter(service, userEmail, password){
        return nodemailer.createTransport({
                    service: service,
                    auth: {
                        user: userEmail,
                        pass: password 
                    }
                });
    }

    sendMail(to, from, subject, text, transporter){
        var mailOptions = {
            to: to,
            from: from,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error)
                console.log(error);
            else
                console.log(info);
        });
    }
}

module.exports = Mail;