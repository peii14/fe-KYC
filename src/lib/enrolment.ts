import { Gateway, Wallets } from 'fabric-network';
import FabricCAClient from 'fabric-ca-client';
import path from 'path';

export async function enrollEntity(orgNumber:string, adminName:string, connection:any) {
    try {
        // load the network configuration
        const ccp = connection

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[`ca.org${orgNumber}.example.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAClient(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the adminName user.
        const identity = await wallet.get(adminName);
        if (identity) {
            console.log(`An identity for the admin user "${adminName}" already exists in the wallet`);
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `Org${orgNumber}MSP`,
            type: 'X.509',
        };

        await wallet.put(adminName, x509Identity);
        console.log(`Successfully enrolled admin user "${adminName}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll admin user "${adminName}": ${error}`);
        process.exit(1);
    }
}

