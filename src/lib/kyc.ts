
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

async function getContract(entity:string) {
  const walletPath = path.join(process.cwd(), '../wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  
  // get org1 connection profile
  const whichOrg = parseInt((await wallet.get(entity)).mspId.replace(/\D/g, ""));
  
  const connectionProfilePath = path.resolve(process.cwd(),`../hyperledger-fabric/test-network/organizations/peerOrganizations/org${whichOrg}.example.com/connection-org${whichOrg}.json`);
  const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
  
  const connectionOptions = {
    wallet,
    identity: entity,
    discovery: { enabled: true, asLocalhost: true },
  };

  await gateway.connect(connectionProfile, connectionOptions);
  const network = await gateway.getNetwork('mychannel');
  return network.getContract('eKYC');
}

async function executeContractTransaction(transactionName:string,entity:string, ...args) {
  try {
    const contract = await getContract(entity);
    const result = await contract.submitTransaction(transactionName, ...args);
    return result.toString();
  } catch (error) {
    throw error;
  }
}
// Initiate ledger
export async function initLedger(entity:string) {
  return executeContractTransaction('initLedger',entity);
}

// PPRIVATE DATA
export async function submitKycData(walletAddress: string, encryptedKycData: any, entity: string) {
   return executeContractTransaction('submitKycData', entity,walletAddress, JSON.stringify(encryptedKycData));

}
export async function getKycData(financialInstitution:string, peerMSPID:string, entity:string) {
  return executeContractTransaction('getKycData',entity,entity, financialInstitution, peerMSPID);
}

// KYC REQEUSTS
export async function requestValidation(designated_bank:string,entity:string ) {
  return executeContractTransaction('requestValidation',entity,designated_bank);
}
export async function getRequestValidation(walletAddress:string, designated_bank:string, entity:string) {
  return executeContractTransaction('getRequestValidation',entity, walletAddress, designated_bank );
}
export async function getRequstByDesignatedBank(entity:string) {
  return executeContractTransaction('getRequestsByDesignatedBank',entity, entity);
}

// USER PROFILE
export async function createUserProfile(userId:Number, ethereumAddress:String,entity:string) {
  return executeContractTransaction('createUserProfile',entity, userId, ethereumAddress);
}

export async function getUserProfile(userId:Number,entity:string) {
  return executeContractTransaction('getUserProfile',entity ,userId);
}
// FINANCIAL INSTITUTIONS
export async function addApprovedFinancialInstitution(financialInstitution:string, mspid:String,entity:string) {
  return executeContractTransaction('addApprovedFinancialInstitution',entity ,financialInstitution,mspid);
}
export async function getApprovedFinancialInstitutions(entity:string) {
  return executeContractTransaction('getApprovedFinancialInstitutions',entity);
}
export async function removeApprovedFinancialInstitution(financialInstitution:string, mspid:String,entity:string) {
  return executeContractTransaction('removeApprovedFinancialInstitution',entity ,financialInstitution, mspid);
}

export const collectionConfig = [
  {
    "name": "customerPrivateData",
    "policy": "OR('Org1MSP.member', 'Org2MSP.member')",
    "requiredPeerCount": 0,
    "maxPeerCount": 3,
    "blockToLive": 1000000
  }
]
