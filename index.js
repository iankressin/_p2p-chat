const topology = require("fully-connected-topology");
const streamSet = require("stream-set");

const me = process.argv[2];
const friend = process.argv[3];

let con;

const activePeers = streamSet();

const peer = topology(me, [friend]);

peer.on("connection", (connection, peer) => {
  activePeers.add(connection);
  connection.on("data", data => {
    console.log("Data: ");
  });
});

process.stdin.on("data", data => {
  const msg = data.toString().trim();
  activePeers.forEach(connection => {
    connection.write(msg);
  });
});
