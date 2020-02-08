const jsonStream = require("duplex-json-stream");
const streamSet = require("stream-set");
const topology = require("fully-connected-topology");
const dnsRegister = require("register-multicast-dns");
const hashToPort = require("hash-to-port");

const me = process.argv[2];
const friends = process.argv.slice(3);

dnsRegister(me);

const swarm = topology(toAddress(me), friends.map(toAddress));
const activePeers = streamSet();
const id = Math.random();
let seq = 0;
const logs = {};

swarm.on("connection", socket => {
  console.log("New connection");
  socket = jsonStream(socket);
  activePeers.add(socket);
  //Register a new event data for the new connection
  socket.on("data", data => {
    if (logs[data.log] <= data.seq) {
      return;
    }
    logs[data.log] = data.seq;
    console.log(`${data.username} >>> ${data.msg}`);
    activePeers.forEach(activeFriend => {
      activeFriend.write(data);
    });
  });
});

process.stdin.on("data", data => {
  let next = seq++;
  const msg = data.toString().trim();
  activePeers.forEach(connection => {
    connection.write({ log: id, seq: seq, username: me, msg: msg });
  });
});

function toAddress(name) {
  // TODO: local doesnt work demands to be localhost (?????)
  return `${name}.localhost:${hashToPort(name)}`;
}
