const Mailgen = require('mailgen');
const emailConfig = require('../config/emailConfig.json')
const dotenv = require('dotenv')

const nodemailer = require("nodemailer");

dotenv.config()

const {
  EMAIL_SERVICE_LOGIN,
  EMAIL_SERVICE_PASSWORD,
  EMAIL_SERVICE_PORT,
  EMAIL_SERVICE_HOST
} = process.env


class EmailService {
  #sender = nodemailer
  #GenerateTemplate = Mailgen
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = emailConfig.dev
        break
 
      case 'production':
        this.link = emailConfig.prod
        break
    
      case 'stage':
        this.link = emailConfig.stage
        break
    
      default:
        this.link = emailConfig.dev
        break
    }
  }

  #createTemplate(verifyToken, name = 'Guest') {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {        
        name: 'Contacts Book Eko',
        link: this.link
      } 
    });
    const template = {
      body: {
        name,
        intro: 'Welcome to Contacts Book Eko',
        action: {
          instructions: 'For confirm your account click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm',
            link: `${this.link}/auth/verify/${verifyToken}`
          },
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
      }
    }
    return mailGenerator.generate(template)
  }
  

  async sendEmail(verifyToken, email, name) {
    const emailBody = this.#createTemplate(verifyToken, name)

    const transporter = this.#sender.createTransport({
      host: EMAIL_SERVICE_HOST,
      port: EMAIL_SERVICE_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: EMAIL_SERVICE_LOGIN, // generated ethereal user
        pass: EMAIL_SERVICE_PASSWORD, // generated ethereal password
      },
    })

    await transporter.sendMail({
      from: EMAIL_SERVICE_LOGIN, 
      to: email, 
      subject: "Ferify your email ✔", 
      html: emailBody, 
    })
 }
}

module.exports = EmailService