const Imap = require('imap');
const nodemailer = require("nodemailer");
const fs=require("fs")
const { simpleParser } = require('mailparser');

// const imap = new Imap({
  //   user: 'hassanphotos2008@gmail.com', // Your email address
  //   password: 'gzhaihlqwudpndgg', // Your email password (use app password if required)
  //   host: 'imap.gmail.com', // IMAP server
  //   port: 993, // IMAP port
  //   tls: true, // Use TLS
  //   tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certificates
  // });
// const logFileStream=fs.createWriteStream("app.json",{ flags: 'a' })
// const imap = new Imap({
//   user: 'epics-india@tifrh.res.in', // Your email address
//   password: 'tancmzriscvyakuk', // Your email password (use app password if required)
//   host: 'imap.gmail.com', // IMAP server
//   port: 993, // IMAP port
//   tls: true, // Use TLS
//   tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certificates
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "epics-india@tifrh.res.in", // Sender's email (authenticated Gmail)
    pass: "tancmzriscvyakuk", // Use an App Password if 2FA is enabled
  },
});



function startImapListener() {
const imap = new Imap({
  user: 'epics-india@tifrh.res.in', // Your email address
  password: 'tancmzriscvyakuk', // Your email password (use app password if required)
  host: 'imap.gmail.com', // IMAP server
  port: 993, // IMAP port
  tls: true, // Use TLS
  tlsOptions: { rejectUnauthorized: false }, 
});

  imap.once('ready', function () {
    console.log('IMAP Connection Ready');

    imap.openBox('INBOX', false, function (err,box) {
      if (err) {
        console.error('Failed to open INBOX:', err);
        return;
      }
      console.log('Listening for new emails...');

      imap.on('mail', function (numNewMsgs) {
        console.log(`New email received! (${numNewMsgs} new messages)`);

        // Email options
        const mailOptions = {
          from: '"EPICS forum" <epics-india@tifrh.res.in>', // Sender (shown as the sender)
          to: "testing4444@googlegroups.com", // Recipient
          replyTo: "psharma@tifrh.res.in", // Reply-To address
          subject: "Test Email with Reply-To",
          text: "This is a test email. Replies will go to email2@gmail.com.",
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      });
    });
  });

  imap.once('error', function (err) {
    console.error('IMAP Error:', err);
    console.log('Reconnecting in 5 seconds...');
    setTimeout(startImapListener, 5000); // Reconnect after 5 seconds
  });

  imap.once('end', function () {
    console.log('IMAP Connection Ended. Reconnecting...');
    startImapListener(); // Restart on unexpected disconnect
  });

  imap.connect();
}

// Start the listener
startImapListener();
