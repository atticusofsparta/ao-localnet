import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import pkg from "warp-arbundles";
import * as fs from "fs"
import { arweave } from "./constants.js";
import path from "path"

const { ArweaveSigner, createData } = pkg;


async function main () {

    const schedulerWallet = await JSON.parse(fs.readFileSync(path.join(path.resolve(), "/wallets/scheduler-location-publisher-wallet.json")));
    const schedulerWalletAddress = await arweave.wallets.jwkToAddress(schedulerWallet);

    console.log('deploying module')
    
    const jwk = await JSON.parse(fs.readFileSync(path.join(path.resolve(), "/wallets/aos-wallet.json")));
    const signer = new ArweaveSigner(jwk);
    const moduleData = await fs.readFileSync(path.join(path.resolve(), "experiments/module.wasm"));

    const dataItem = await createData(moduleData, signer)
    await dataItem.sign(signer);
    console.log(`deploying module ${await dataItem.id} to bundler`)
    const body = await dataItem.getRaw()
    fetch("http://localhost:4007", {
        method: "POST",
        body,
        headers: {
            // wasm content type
            "Content-Type": "application/wasm"
        }
    })

    const moduleId = await dataItem.id;

    
    const { spawn } = await connect({
        GATEWAY_URL: "http://localhost:4000",
        GRAPHQL_URL: "http://localhost:4000/graphql",
        MU_URL: "http://localhost:4002",
        CU_URL: "http://localhost:4004",
    });

    console.log(`spawning process with module id ${moduleId}`)
    const processId = await spawn({
        scheduler: schedulerWalletAddress,
        module: moduleId,
        signer: createDataItemSigner(signer)
    });

    console.log(`process spawned with id ${processId}`)


}

main()