const fs = require("fs");
const path = require("path");

const fileName = path.join(__dirname, "details.txt");
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  const body = [];
  if (method == "GET") {
    if (url == "/") {
      res.setHeader("Content-Type", "text/html");
      res.write("<html>");
      res.write("<head><title>Awesome Site!</title></head>");
      res.write(`<body>
        <h1>Hello from Epic</h2>
        <p>Please enter your details to know more about us</p>
        <form method="post" action="/details">
            <input type="email" name="email" placeholder="Email"/>
            <input type="text" name="fullname" placeholder="Full Name"/>
            <input type="submit" value="Submit"/>
        </form>
        </body>`);
      res.write("</html>");
    } else if (url.includes("/success")) {
      res.setHeader("Content-Type", "text/html");
      res.write("<html>");
      res.write("<head><title>Awesome Site!</title></head>");
      res.write(`<body>
            <h1>Your Details are Successfully recorded !</h1>
            <h3>Continue Surfing</h3>
            <form action="/redirect" method="get">
                <input type="submit" value="Go Back To Home"/>
            </form>
            </body>`);
      res.write("</html>");
    } else if (url.includes("/redirect")) {
      res.statusCode = 302;
      res.setHeader("Location", "/");
    }
    res.end();
  } else if (method == "POST") {
    if (url == "/details") {
      req.on("data", (chunks) => {
        console.log(chunks);
        body.push(chunks);
      });
      return req.on("end", () => {
        const data = Buffer.concat(body).toString();
        const dataParsed = data
          .split("&")
          .map((d) => d.split("="))
          .map(([key, value]) => [
            decodeURIComponent(key.replace(/\+/g, " ")),
            decodeURIComponent(value.replace(/\+/g, " ")),
          ]);
        console.log(dataParsed, "data");
        let fileWrite = null;
        try {
          fileWrite = fs.appendFile;
        } catch (err) {
          fileWrite = fs.writeFile;
        }
        if (fileWrite)
          fileWrite(
            fileName,
            dataParsed[0] + "\n" + dataParsed[1] + "\n \n",
            (err) => {
              if (!err) {
                res.statusCode = 302;
                res.setHeader("Location", "/success");
                return res.end();
              }
              console.log(err, "error");
            }
          );
      });
    }
  }
};

module.exports = requestHandler;
