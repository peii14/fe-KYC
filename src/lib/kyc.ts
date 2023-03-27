
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

async function getContract() {
  const walletPath = path.join(process.cwd(), '../wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  const connectionProfilePath = path.resolve(process.cwd(), 'src/lib/connection.json');
  const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

  // TODO: work on identity
  const connectionOptions = {
    wallet,
    identity: 'BCA', // Replace this with the user identity you have enrolled and added to the wallet
    discovery: { enabled: true, asLocalhost: true },
  };

  await gateway.connect(connectionProfile, connectionOptions);
  const network = await gateway.getNetwork('mychannel');
  return network.getContract('eKYC');
}

export async function submitKycData(customerId, kycData) {
  try {
    const contract = await getContract();
    const result = await contract.submitTransaction('submitKycData', customerId, kycData);
    return result.toString();
  } catch (error) {
    throw error;
  }
}
export async function createUserProfile(userId,ethereumAddress){
  try {
    const contract = await getContract();
    const result = await contract.submitTransaction('createUserProfile', userId,ethereumAddress);
    return result.toString();
  } catch (error) {
    throw error;
  }
}
