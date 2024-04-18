import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import * as fs from "fs"
import { arweave } from "./constants.js";
import path from "path"

async function main () {

    const schedulerWallet = await JSON.parse(fs.readFileSync(path.join(path.resolve(), "/wallets/scheduler-location-publisher-wallet.json")));
    const schedulerWalletAddress = await arweave.wallets.jwkToAddress(schedulerWallet);

    console.log('deploying module')
    
    const jwk = await JSON.parse(fs.readFileSync(path.join(path.resolve(), "/wallets/aos-module-publisher-wallet.json")));
    const moduleData = fs.readFileSync(path.join(path.resolve(), "experiments/module.wasm"));

    const tx = await arweave.createTransaction({
        data: moduleData
      })
      
    tx.addTag('Memory-Limit',    '500-mb'                   )
    tx.addTag('Compute-Limit',   '9000000000000'            )
    tx.addTag('Data-Protocol',   'ao'                       )
    tx.addTag('Type',            'Module'                   )
    tx.addTag('Module-Format',   'wasm32-unknown-emscripten')
    tx.addTag('Input-Encoding',  'JSON-1'                   )
    tx.addTag('Output-Encoding', 'JSON-1'                   )
    tx.addTag('Variant',         'ao.LN.1'                  )
    tx.addTag('Content-Type',    'application/wasm'         )
    
    await arweave.transactions.sign(tx, jwk)
    
    console.log(`deploying module ${tx.id} to arlocal`)

    await arweave.transactions.post(tx)

    const moduleId = tx.id;

    const { spawn } = connect({
        GATEWAY_URL: "http://localhost:4000",
        GRAPHQL_URL: "http://localhost:4000/graphql",
        MU_URL: "http://localhost:4002",
        CU_URL: "http://localhost:4004",
    });

    console.log(`spawning process with module id ${moduleId}`)
    const processId = await spawn({
        scheduler: schedulerWalletAddress,
        module: moduleId,
        signer: createDataItemSigner(jwk)
    });

    console.log(`process spawned with id ${processId}`)


}

main()