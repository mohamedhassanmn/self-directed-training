const http = require("http");

const routes = require("./routes");

const port = 3000;

const server = http.createServer(routes);

server.listen(port, () => {
  console.log(`Listening in port ${port}!`);
});
