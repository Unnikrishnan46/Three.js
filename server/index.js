const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://3d-portfolio-server.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


const userEmail = 'erayamcode2004@gmail.com';
const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'erayamcode2004@gmail.com', // Your Gmail email address
        pass: 'cbvp rsfg aqlz pzuq' // Your Gmail password or an app-specific password if you have 2-factor authentication enabled
    }
};


const transporter = nodemailer.createTransport(smtpConfig);

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    const mailOptions = {
        from: email,
        to: userEmail,
        subject: 'New Portfolio Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Message sent successfully!');
        }
    });
    
  });


const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})