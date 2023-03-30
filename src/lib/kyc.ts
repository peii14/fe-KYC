
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

async function getContract() {
  const walletPath = path.join(process.cwd(), '../wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  const connectionProfilePath = path.resolve(process.cwd(), 'src/lib/connection.json');
  const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
  
  const connectionOptions = {
    wallet,
    identity: 'SUPER-ADMIN', // Replace this with the user identity you have enrolled and added to the wallet
    discovery: { enabled: true, asLocalhost: true },
  };

  await gateway.connect(connectionProfile, connectionOptions);
  const network = await gateway.getNetwork('mychannel');
  return network.getContract('eKYC');
}

async function executeContractTransaction(transactionName, ...args) {
  try {
    const contract = await getContract();
    const result = await contract.submitTransaction(transactionName, ...args);
    return result.toString();
  } catch (error) {
    throw error;
  }
}

export async function submitKycData(customerId, kycData) {
  return executeContractTransaction('submitKycData', customerId, kycData);
}

export async function createUserProfile(userId:Number, ethereumAddress:String) {
  return executeContractTransaction('createUserProfile', userId, ethereumAddress);
}

export async function getUserProfile(userId:Number) {
  return executeContractTransaction('getUserProfile', userId);
}
export async function getKycData(customerId:Number) {
  return executeContractTransaction('getKycData', customerId);
}
export async function addApprovedFinancialInstitution(financialInstitution:string, mspid:String) {
  return executeContractTransaction('addApprovedFinancialInstitution', financialInstitution,mspid);
}
export async function getApprovedFinancialInstitutions() {
  return executeContractTransaction('getApprovedFinancialInstitutions');
}
export async function removeApprovedFinancialInstitution(financialInstitution:string, mspid:String) {
  return executeContractTransaction('removeApprovedFinancialInstitution', financialInstitution, mspid);
}