import { Gateway, Wallets, Contract } from "fabric-network";
import path from "path";
import fs from "fs";

export async function instantiateChaincode(
  entity: string,
  chaincodeName: string,
  chaincodeVersion: string,
  collectionConfig: any
): Promise<void> {
  try {
    const walletPath = path.join(process.cwd(), "../wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const gateway = new Gateway();

    const whichOrg = parseInt(
      (await wallet.get(entity)).mspId.replace(/\D/g, "")
    );
    const connectionProfilePath = path.resolve(
      process.cwd(),
      `../hyperledger-fabric/test-network/organizations/peerOrganizations/org${whichOrg}.example.com/connection-org${whichOrg}.json`
    );
    const connectionProfile = JSON.parse(
      fs.readFileSync(connectionProfilePath, "utf8")
    );
    const connectionOptions = {
      wallet,
      identity: entity,
      discovery: { enabled: true, asLocalhost: true },
    };

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork("mychannel");
    const contract: Contract = network.getContract("_lifecycle");

    const endorsementPolicy = {
      identities: [
        { role: { name: "member", mspId: "Org1MSP" } },
        { role: { name: "member", mspId: "Org2MSP" } },
      ],
      policy: {
        "1-of": [{ "signed-by": 0 }, { "signed-by": 1 }],
      },
    };

    console.log("Instantiating chaincode...");

    // Approve the chaincode definition for the organization
    const approveTx = contract.createTransaction(
      "ApproveChaincodeDefinitionForMyOrg"
    );
    const param = JSON.stringify({
      chaincodeName: chaincodeName,
      version: chaincodeVersion,
      sequence: 1,
      collections: collectionConfig,
      endorsement_policy: endorsementPolicy,
    });
    await approveTx.submit(param);

    // Commit the chaincode definition
    const commitTx = contract.createTransaction("CommitChaincodeDefinition");
    await commitTx.submit(param);

    console.log(
      `Chaincode ${chaincodeName}@${chaincodeVersion} instantiated successfully.`
    );
  } catch (error) {
    console.error(`Failed to instantiate chaincode: ${error}`);
    throw error;
  }
}
