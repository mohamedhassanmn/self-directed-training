const Imap = require("imap");
const nodemailer = require("nodemailer");
const { simpleParser } = require("mailparser");

const imapConfig = {
  user: 'epics-india@tifrh.res.in', // Your email address
  password: 'tancmzriscvyakuk', // Your email password (use app password if required)
  host: 'imap.gmail.com', // IMAP server
  port: 993, // IMAP port
  tls: true, // Use TLS
  tlsOptions: { rejectUnauthorized: false }, 
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "epics-india@tifrh.res.in", // Sender's email (authenticated Gmail)
    pass: "tancmzriscvyakuk", // Use an App Password if 2FA is enabled
  },
});


function startImapListener() {

  const imap = new Imap(imapConfig);
  let lastProcessedUID = null; // Store last processed UID

  function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
  }

  imap.once("ready", () => {
    console.log(" IMAP Connected. Opening INBOX...");

    openInbox((err, box) => {
      if (err) throw err;

      // Store the latest email UID at startup to prevent processing old emails
      imap.search(["UNSEEN"], (err, results) => {
        if (!err && results.length > 0) {
          lastProcessedUID = Math.max(...results); // Track highest unseen email UID
        } else {
          lastProcessedUID = 0; // No unseen emails yet
        }
        console.log(`Last Processed UID on Startup: ${lastProcessedUID}`);
      });
    });
  });

  // Listen for new emails, but only fetch *new unseen* ones
  imap.on("mail", () => {
    console.log(` New mail detected! Checking for unseen emails...`);

    imap.search(["UNSEEN"], (err, results) => {
      if (err) {
        console.error("Search error:", err);
        return;
      }

      if (!results || results.length === 0) {
        console.log("No truly new unseen emails found.");
        return;
      }

      // Filter for emails received AFTER the last processed UID
      const newEmails = results.filter((uid) => uid > lastProcessedUID);
      if (newEmails.length === 0) {
        console.log("No truly new unseen emails found.");
        return;
      }

      // Fetch only the truly new unseen emails
      const fetch = imap.fetch(newEmails, { bodies: "" });

      fetch.on("message", (msg) => {
        let rawEmail = "";

        msg.on("body", (stream) => {
          stream.on("data", (chunk) => {
            rawEmail += chunk.toString();
          });
        });

        msg.once("end", async () => {
          const parsed = await simpleParser(rawEmail);
          // console.log("📨 New Email:");
          // console.log("From:", parsed.from.text);
          // console.log("Subject:", parsed.subject);
          // console.log("Text Body:", parsed.text);
          // console.log("HTML Body:", parsed.html);
          console.log(parsed.from.text,parsed.from.text.includes('epics-india'),"print this")

          if (!parsed.from.text.includes('epics-india')){
            const recipients = ["hassanaesthete008@gmail.com", "mohamedhassan008.work@gmail.com","mohamedhassan@tifrh.res.in","sandeepkm@tifrh.res.in"];
              // Email options
            const mailOptions = {
              from: parsed.from.text,
              bcc: recipients,
              to: "epics-india@tifrh.res.in" ,
              // to: "testing4444@googlegroups.com",
              replyTo: parsed.from.text ,
              subject: parsed.subject,
              // text: parsed.text,
              html:parsed.html,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error:", error);
              } else {
                console.log("Email sent:", info.response);
              }
            });
          }

          // Update lastProcessedUID to avoid reprocessing
          lastProcessedUID = Math.max(...newEmails);
        });
      });

      fetch.once("error", (err) => {
        console.error("Fetch error:", err);
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error:", err);
  });

  imap.once("end", () => {
    console.log("IMAP connection closed.");
  });

  // Start IMAP connection
  imap.connect();
}

startImapListener();