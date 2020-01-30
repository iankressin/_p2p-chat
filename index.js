const jsonStream = require("duplex-json-stream");
const topology = require("fully-connected-topology");
const streamSet = require("stream-set");

const me = process.argv[2];
const friend = process.argv[3];

const activePeers = streamSet();

const peer = topology(me, [friend]);

peer.on("connection", socket => {
  socket = jsonStream(socket);
  activePeers.add(socket);

  //Register a new event data for the new connection
  socket.on("data", data => {
    console.log(`${data.username} >>> ${data.msg}`);
  });
});

process.stdin.on("data", data => {
  const msg = data.toString().trim();
  activePeers.forEach(connection => {
    connection.write({ username: me, msg: msg });
  });
});
