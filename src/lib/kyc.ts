
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
// PPRIVATE DATA
export async function submitKycData(customerId, kycData, entity:string) {
  return executeContractTransaction('submitKycData',entity, customerId, kycData);
}

export async function getKycData(customerId:Number, entity:string) {
  return executeContractTransaction('getKycData',entity, customerId);
}
// KYC REQEUSTS

export async function requestValidation(customerId:Number, walletAddress:string, currentStatus:string, email: string,entity:string ) {
  return executeContractTransaction('requestValidation',entity, customerId);
}

export async function getRequestValidation(customerId:string,entity:string) {
  return executeContractTransaction('getRequestValidation',entity, customerId);
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
  return executeContractTransaction('addApprovedFinancialInstitution', financialInstitution,mspid);
}
export async function getApprovedFinancialInstitutions(entity:string) {
  return executeContractTransaction('getApprovedFinancialInstitutions',entity);
}
export async function removeApprovedFinancialInstitution(financialInstitution:string, mspid:String,entity:string) {
  return executeContractTransaction('removeApprovedFinancialInstitution',entity ,financialInstitution, mspid);
}