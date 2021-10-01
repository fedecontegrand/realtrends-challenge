import * as io from "socket.io";

import {product0, product1, vote0, vote1, vote2} from "./data";
import {Product, Vote} from "./types";

const server = new io.Server(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const products: Product[] = [product0, product1];
var votes: Vote[] = [vote0, vote1, vote2];

server.on("connection", (socket) => {
  socket.on("addvote", (arg: Vote) => {
    const v = votes.filter((vote) => vote.user === arg.user);
    v.length
      ? ((v[0].product = arg.product), (v[0].comment = arg.comment))
      : votes.push({user: arg.user, comment: arg.comment, product: arg.product} as Vote);
    socket.broadcast.emit("addvote", {products, votes});
    console.log("Subida de voto");
  });
});

server.on("connection", (socket) => {
  socket.on("finish", (arg: Vote[]) => {
    votes = arg;
    socket.broadcast.emit("finish", {products, votes: arg});
    console.log("Fin VOTE");
  });
});

server.on("connection", (socket) => {
  socket.on("stateServer", (state: string) => {
    socket.broadcast.emit("stateServer", state);
    console.log("CAMBIO ESTADO SERVER");
  });
});

server.on("connection", (socket) => {
  socket.emit("state", {products, votes});
  console.log("1 subida");
});
