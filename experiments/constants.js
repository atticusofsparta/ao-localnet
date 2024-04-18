import Arweave from "arweave";

export const arweave = Arweave.init({
    host: "localhost",
    port: 4000,
    protocol: "http",
});