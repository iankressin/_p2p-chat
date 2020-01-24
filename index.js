const topology = require("fully-connected-topology");
const streamSet = require("stream-set");

const me = process.argv[2];
const friend = process.argv[3];

const activePeers = streamSet();

const peer = topology(me, friend);

// TODO: share activePeers with new connection
// eu PRECISO ter pelo menos uma conexao
peer.on("connection", (connection, p) => {
  activePeers.add(connection);
});

process.stdin.on("data", data => {
  const msg = data.toString().trim();
  activePeers.streams.forEach(connection => {
    connection.write(msg);
  });
});

// const peer

// meCon.on("connection", (connection, peer) => {
//   console.log(`${me} connected to peer ${peer}`);
// });

// friendCon.on("connection", (connection, peer) => {
//   console.log(`${friend} connected to peer ${peer}`);
// });

// const t1Addr = "127.0.0.1:4001";
// const t2Addr = "127.0.0.1:4002";
// const t3Addr = "127.0.0.1:4003";

// const t1 = topology(t1Addr, [t2Addr, t3Addr]);
// const t2 = topology(t2Addr, [t1Addr, t3Addr]);
// const t3 = topology(t3Addr, [t1Addr, t2Addr]);

// t1.on("connection", (connection, peer) => {
//   console.log(`t1 is connected to ${peer}`);
// });

// t2.on("connection", (connection, peer) => {
//   console.log(`t2 is connected to ${peer}`);
// });

// t3.on("connection", (connection, peer) => {
//   console.log(`t3 is connected to ${peer}`);
// });
