import * as React from "react";
import SocketIO, {io} from "socket.io-client";

import {Product, Vote} from "../../../../../server/src/types";
import logo from "~/assets/logo.svg";

import styles from "./Home.module.scss";

const socket = SocketIO.io("http://localhost:5000");

interface DataServer {
  products: Product[];
  votes: Vote[];
}

const Home: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [votes, setVotes] = React.useState<Vote[]>([]);
  const [state, setState] = React.useState<"connected" | "disconnected">("connected");

  const addVote = (key: string) => {
    if (state === "disconnected") return;
    const userNew: string = window.prompt("Usuario") || "";
    const commentNew: string = window.prompt("Comentario") || "";

    if (!userNew) return;
    socket.emit("addvote", {product: key, user: userNew, comment: commentNew} as Vote);
    const newV = votes.map((vote) => {
      if (vote.user === userNew) {
        vote.comment = commentNew || "";
        vote.product = key;

        return vote;
      } else return vote;
    });

    setVotes(newV);
    console.log("Agregado de voto");
  };

  socket.on("addvote", (data: DataServer) => {
    setProducts(data.products);
    setVotes(data.votes);
  });

  socket.on("finish", (data: DataServer) => {
    setProducts(data.products);
    setVotes(data.votes);
  });

  socket.on("connection", (data: DataServer) => {
    setProducts(data.products);
    setVotes(data.votes);
  });

  socket.on("stateServer", (stateServer: "connected" | "disconnected") => {
    setState(stateServer);
  });

  React.useEffect(() => {
    socket.on("state", (data: DataServer) => {
      setProducts(data.products);
      setVotes(data.votes);
      setState("connected");
      console.log("use Effect");
    });
  }, []);

  const changeConnection = (status: string) => {
    if (status === "disconnect") {
      socket.emit("stateServer", "disconnected");
      setState("disconnected");

      return socket.disconnect();
    } else if (status === "connect") {
      socket.emit("stateServer", "connected");
      setState("connected");

      return socket.connect();
    } else if (status === "finish") {
      setVotes([]);
      socket.emit("finish", [] as Vote[]);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>
          <img alt="RealTrends" src={logo} width={180} />
        </h1>
        <h3>Lets get this party started</h3>
      </header>
      <>
        <div className={styles.productsGrid}>
          {products.length ? (
            products.map((product) => (
              <div key={product.key} className={styles.border}>
                <div className={styles.product} onClick={() => addVote(product.key)}>
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <img alt="imagenProd" className={styles.prodImage} src={product.image} />
                  </div>
                  <div className={styles.votesDiv}>
                    <span>
                      {votes.filter((votes) => votes.product === product.key).length} voto(s)
                    </span>
                    <div className={styles.divAllVotes}>
                      {votes
                        .filter((vote) => vote.product === product.key)
                        .map(
                          (vote) =>
                            vote.comment && (
                              <div className={styles.userVote}>
                                <span>{vote.user}: </span>
                                <p>{vote.comment}</p>
                              </div>
                            ),
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3>Cargando...</h3>
          )}
        </div>
        <footer>
          {state === "connected" ? (
            <h3 onClick={() => changeConnection("disconnect")}>Parar votacion</h3>
          ) : state === "disconnected" ? (
            <h3 onClick={() => changeConnection("connect")}>Reanudar votacion</h3>
          ) : (
            <h6>cargando..</h6>
          )}
          <h3 onClick={() => changeConnection("finish")}>Finalizar votacion</h3>
        </footer>
      </>
      )
    </main>
  );
};

export default Home;
