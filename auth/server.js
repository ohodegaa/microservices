const http = require("http");
const app = require("./app");

const port = process.env.PORT || 4040;


const server = http.createServer(app);

console.log("Auth server listening on port " + port);
server.listen(port);

