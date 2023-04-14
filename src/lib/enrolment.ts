import { Gateway, Wallets } from "fabric-network";
import FabricCAClient from "fabric-ca-client";
import { User } from "fabric-common";
import path from "path";
import fs from "fs";
import { generateECIESKeyPair } from "@/helper/private_data";
import { Identity } from "fabric-network";

interface X509Identity extends Identity {
  credentials: {
    certificate: string;
    privateKey: string;
  };
  mspId: string;
  type: "X.509";
  metadata?: {
    attrs: {
      hf: {
        Role: string;
        OU: string;
      };
    };
  };
}

export async function enrollAdmin(orgNumber: string, adminName: string) {
  try {
    const connectionProfilePath = path.resolve(
      process.cwd(),
      `../hyperledger-fabric/test-network/organizations/peerOrganizations/org${orgNumber}.example.com/connection-org${orgNumber}.json`
    );
    const connectionProfile = JSON.parse(
      fs.readFileSync(connectionProfilePath, "utf8")
    );

    // Create a new CA client for interacting with the CA.
    const caInfo =
      connectionProfile.certificateAuthorities[
        `ca.org${orgNumber}.example.com`
      ];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAClient(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "../wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminName);
    if (identity) {
      console.log(
        `An identity for the user "${adminName}" already exists in the wallet`
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
      attr_reqs: [
        { name: "hf.Registrar.Roles", optional: false },
        { name: "hf.Registrar.Attributes", optional: false },
      ],
    });

    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: `Org${orgNumber}MSP`,
      type: "X.509",
      metadata: {
        // Use an object literal to define the attribute values.
        attrs: {
          hf: {
            Role: "admin",
            OU: "ADMIN",
          },
        },
      },
    };

    // Create encryption key pair.
    const ECIES = await generateECIESKeyPair();
    const cert_path = "../certs/" + adminName + ".json";
    fs.writeFile(cert_path, JSON.stringify(ECIES), (err) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(`Created ECIES key pair for ${adminName}`);
      }
    });

    await wallet.put(adminName, x509Identity);
    console.log(
      `Successfully enrolled admin user "${adminName}" and imported it into the wallet`
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "${adminName}": ${error}`);
    process.exit(1);
  }
}
export async function enrollCustomer(
  orgNumber: number,
  customerId: string,
  adminIdentity: string,
  customerSecret?: string
) {
  try {
    const connectionProfilePath = path.resolve(
      process.cwd(),
      `../hyperledger-fabric/test-network/organizations/peerOrganizations/org${orgNumber}.example.com/connection-org${orgNumber}.json`
    );
    const connectionProfile = JSON.parse(
      fs.readFileSync(connectionProfilePath, "utf8")
    );

    const caInfo =
      connectionProfile.certificateAuthorities[
        `ca.org${orgNumber}.example.com`
      ];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAClient(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    const wallet = await Wallets.newFileSystemWallet("../wallet");

    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
      wallet,
      identity: adminIdentity,
      discovery: { enabled: false },
    });

    // Enroll the customer
    const secret = customerSecret || "customerpw";
    const enrollment = await caClient.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    const customerIdentity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: `Org${orgNumber}MSP`,
      type: "X.509",
    };

    // Save the customer's identity to the wallet
    await wallet.put(customerId, customerIdentity);

    console.log(
      `Successfully enrolled customer "${customerId}" and imported it into the wallet`
    );

    return { customerId, customerIdentity };
  } catch (error) {
    console.error(`Failed to enroll customer "${customerId}": ${error}`);
    throw error;
  }
}
