const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imap = new Imap({
  user: 'XXXX@gmail.com', // Your email address
  password: 'XXXX', // Your email password (use app password if required)
  host: 'imap.gmail.com', // IMAP server
  port: 993, // IMAP port
  tls: true, // Use TLS
  tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certificates
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb); // Open the inbox in read-only mode
}

imap.once('ready', () => {
  openInbox((err, box) => {
    if (err) throw err;
    console.log(`You have ${box.messages.total} messages.`);

    // Search for the last 10 emails
    imap.search(['ALL'], (err, results) => {
      if (err) throw err;

    //   console.log(results,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")

      const fetch = imap.fetch(results.slice(-10).reverse(), { bodies: '' });

    //   console.log(fetch)

      fetch.on('message', (msg, seqno) => {
        console.log(`Message #${seqno}`);
        let rawData = '';

        msg.on('body', (stream) => {
          stream.on('data', (chunk) => {
            rawData += chunk.toString('utf8');
          });
        });

        msg.once('end', async () => {
          const parsed = await simpleParser(rawData);
          console.log('From:', parsed.from.text);
          console.log('Subject:', parsed.subject);
          console.log('Date:', parsed.date);
          console.log('Text:', parsed.text);
        });
      });

      fetch.once('end', () => {
        console.log('Done fetching emails!');
        imap.end();
      });
    });
  });
});

imap.once('error', (err) => {
  console.error(err);
});

imap.once('end', () => {
  console.log('Connection ended.');
});

imap.connect();
