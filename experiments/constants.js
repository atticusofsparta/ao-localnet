import Arweave from "arweave";

export const arweave = Arweave.init({
    host: "http://localhost",
    port: 4000,
    protocol: "http",
});