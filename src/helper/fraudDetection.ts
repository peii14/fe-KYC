// import _ from 'lodash'
import axios from 'axios';
import { mean,unique } from '@/helper/math'
import XGBoost from 'ml-xgboost'
// const XGBoost = dynamic(() => import("ml-xgboost"), { ssr: false });
// import loadXGBoost from 'ml-xgboost/src/loadXGBoost'

function encode_utf8(s:string) {
    const encoder = new TextEncoder()
    return encoder.encode(s)
  }

function avgTime(timeDiff: number[]): string {
  let timeDifference = 0;
  if (timeDiff.length > 1) {
    timeDifference = mean(timeDiff);
  }
  return timeDifference.toFixed(2);
}

function min_max_avg(value_array_tnxs: number[]): [string, string, string] {
  let minVal = 0, maxVal = 0, avgVal = 0;
  if (value_array_tnxs.length > 0) {
    minVal = Math.min(...value_array_tnxs);
    maxVal = Math.max(...value_array_tnxs);
    avgVal = mean(value_array_tnxs);
  }
  return [minVal.toFixed(6), maxVal.toFixed(6), avgVal.toFixed(6)];
}

function uniq_addresses(sent_addresses: string[], received_addresses: string[]): [number, number] {
  let uniqSent = 0, createdContrcts = 0, uniqRec = 0;
  if (sent_addresses.length > 0) {
    uniqSent = unique(sent_addresses).length;
  }
  if (received_addresses.length > 0) {
    uniqRec = unique(received_addresses).length;
  }
  return [uniqSent, uniqRec];
}

function most_frequent(List: any[]): any {
  let counts: {[key: string]: number} = {};
  let mostFrequent = List[0];
  List.forEach(function(val){
    if (!counts[val]) {
      counts[val] = 0;
    }
    counts[val]++;
    if (counts[val] > counts[mostFrequent]) {
      mostFrequent = val;
    }
  });
  return mostFrequent;
}

function timeDiffFirstLast(timestamp: string[]): string {
  let timeDiff = 0;
  if (timestamp.length > 0) {
    const timeDiff = ((new Date(parseInt(timestamp[timestamp.length - 1]) * 1000).getTime() - new Date(parseInt(timestamp[0]) * 1000).getTime()) / 1000 / 60).toFixed(2);
  }
  return timeDiff.toFixed(2);
}

export function token_transfer_transactions(address: string, data: any) {
    let [timestamp, recipients, timeDiffSent, timeDiffReceive, timeDiffContractTnx, receivedFromAddresses, receivedFromContractAddress, sentToAddresses, sentToContractAddresses, sentToContracts, valueSent, valueReceived, valueSentContracts, tokenReceivedName, tokenReceivedSymbol, tokenSentName, tokenSentSymbol, valueReceivedContract, sentToAddressesContract, receivedFromAddressesContract, tokenSentNameContract, tokenSentSymbolContract] = Array.from({length: 22}, () => []);
    let receivedTransactions = 0, sentTransactions = 0, minValReceived = 0, tokenContractTnx = 0, maxValReceived = 0, avgValReceived = 0, minValSent = 0, maxValSent = 0, avgValSent = 0, minValSentContract = 0, maxValSentContract = 0, avgValSentContract = 0;
    let ERC20_contract_tnx_fields = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    if (data['status'] !== '0') {
        for (let tokenTnx = 0; tokenTnx < data['result'].length; tokenTnx++) {
            timestamp.push(data['result'][tokenTnx]['timeStamp'][0]);

            // if receiving
            if (data['result'][tokenTnx]['to'] === address) {
                receivedTransactions++;
                receivedFromAddresses.push(data['result'][tokenTnx]['from']);
                receivedFromContractAddress.push(data['result'][tokenTnx]['contractAddress']);
                valueReceived.push(parseInt(data['result'][tokenTnx]['value']) / 1000000000000000000);

                if (data['result'][tokenTnx]['tokenName'] !== null) {
                    let tName = data['result'][tokenTnx]['tokenName'];
                    tName.replace(/[^\w\s]|_/g, '').replace(/\s+/g, '');
                    tokenReceivedName.push(tName);
                }

                tokenReceivedSymbol.push(data['result'][tokenTnx]['tokenSymbol']);
                if (receivedTransactions > 0) {
                    timeDiffReceive.push((new Date(parseInt(timestamp[tokenTnx]) * 1000).getTime() - new Date(parseInt(timestamp[tokenTnx - 1]) * 1000).getTime()) / 1000 / 60);
                }
            }

            // if sending
            if (data['result'][tokenTnx]['from'] === address) {
                sentTransactions++;
                sentToAddresses.push(data['result'][tokenTnx]['to']);
                sentToContractAddresses.push(data['result'][tokenTnx]['contractAddress']);
                valueSent.push(parseInt(data['result'][tokenTnx]['value']) / 1000000000000000000);

                if (data['result'][tokenTnx]['from'] !== null){
                   let tName = data['result'][tokenTnx]['to']
                   tName.replace(/[^\w\s]|_/g, '').replace(/\s+/g, '');
                    tokenReceivedName.push(tName);
                }
                tokenSentSymbol.push(data['result'][tokenTnx]['tokenSymbol'])
                if(sentTransactions > 0){
                    timeDiffSent.push((new Date(parseInt(timestamp[tokenTnx]) * 1000).getTime() - new Date(parseInt(timestamp[tokenTnx - 1]) * 1000).getTime()) / 1000 / 60);
                }
            }
            // if a contract
            if(data['result'][tokenTnx]['contractAddress'] === address){
                tokenContractTnx = tokenContractTnx +1
                valueReceived.push(Number(data['result'][tokenTnx]['value'])/1000000000000000000)
                sentToAddresses.push(data['result'][tokenTnx],['to'])
                receivedFromAddressesContract.push(data['result'][tokenTnx]['to'])
                if(data['result'][tokenTnx]['tokenName'] !== null){
                    tokenSentNameContract.push(encode_utf8(data['result'][tokenTnx]['tokenName']))
                }
                tokenSentNameContract.push(data['result'][tokenTnx]['tokenName'])
                if(tokenContractTnx > 0){
                    timeDiffContractTnx.push((new Date(parseInt(timestamp[tokenTnx]) * 1000).getTime() - new Date(parseInt(timestamp[tokenTnx - 1]) * 1000).getTime()) / 1000 / 60);
                }
            }
        }
        let totalTnx = receivedTransactions +sentTransactions + tokenContractTnx
        let totalEtherRec = valueReceived.reduce((a,b)=> a+b,0)
        let totalEtherSent = valueSent.reduce((a,b)=>a+b,0)
        let totalEtherContract = valueReceived.reduce((a,b)=>a+b,0)
        let [uniqSentAddr,uniqRecAddr] = uniq_addresses(sentToAddresses, receivedFromAddresses)
        let [uniqSentContAddr,uniqRecContAddr] = uniq_addresses(sentToAddressesContract,receivedFromContractAddress)
        let avgTimeBetweenSentTnx = avgTime(timeDiffSent)
        let avgTimeBetweenRecTnx = avgTime(timeDiffReceive)
        let avgTimeBetweenContractTnx = avgTime(timeDiffContractTnx)
        let [minValReceived, maxValReceived, avgValReceived] = min_max_avg(valueReceived)
        let [minValSent, maxValSent, avgValSent] = min_max_avg(valueSent)
        let [minValSentContract, maxValSentContract, avgValSentContract] = min_max_avg(valueSentContracts)
        // let uniqSentTokenName = _.uniq(tokenSentName).length()
        // let uniqRecTokenName = _.uniq(tokenReceivedName).length()

        ERC20_contract_tnx_fields = [totalTnx, totalEtherRec, totalEtherSent, totalEtherContract, uniqSentAddr, uniqRecAddr,
            uniqSentContAddr, uniqRecContAddr, avgTimeBetweenSentTnx,
            avgTimeBetweenRecTnx, avgTimeBetweenRecTnx, avgTimeBetweenContractTnx,
            minValReceived, maxValReceived, avgValReceived,
            minValSent, maxValSent, avgValSent,
            minValSentContract, maxValSentContract, avgValSentContract,
            ]
            ERC20_contract_tnx_fields = ERC20_contract_tnx_fields.map((isStr:any)=> Number(isStr))
            return ERC20_contract_tnx_fields
    }
}
export function normalTransactions(address: string,data:any){
        let receivedTransactions = 0;
        let sentTransactions = 0;
        let createdContracts = 0;
        let minValReceived = 0;
        let maxValReceived = 0;
        let avgValReceived = 0;
        let minValSent = 0;
        let maxValSent = 0;
        let avgValSent = 0;
        let minValSentContract = 0;
        let maxValSentContract = 0;
        let avgValSentContract = 0;
        const timestamp: any[] = [];
        const recipients: string[] = [];
        const timeDiffSent: number[] = [];
        const timeDiffReceive: number[] = [];
        const receivedFromAddresses: string[] = [];
        const sentToAddresses: string[] = [];
        const sentToContracts: string[] = [];
        const valueSent: number[] = [];
        const valueReceived: number[] = [];
        const valueSentContracts: number[] = [];
  
        if (data.status !== '0') {
          for (let tnx = 0; tnx < data.result.length; tnx++) {
            if (data.result[tnx].isError === '1') {
              continue;
            }
            timestamp.push(parseInt(data.result[tnx].timeStamp));
            if (data.result[tnx].to === address) {
              receivedTransactions += 1;
              receivedFromAddresses.push(data.result[tnx].from);
              valueReceived.push(parseInt(data.result[tnx].value) / 1000000000000000000);
              if (receivedTransactions > 0) {
                timeDiffReceive.push((new Date(parseInt(timestamp[tnx]) * 1000).getTime() - new Date(parseInt(timestamp[tnx - 1]) * 1000).getTime()) / 1000 / 60);
              }
            }
            if (data.result[tnx].from === address) {
              sentTransactions += 1;
              sentToAddresses.push(data.result[tnx].to);
              valueSent.push(parseInt(data.result[tnx].value) / 1000000000000000000);
              if (sentTransactions > 0) {
                timeDiffSent.push((new Date(parseInt(timestamp[tnx]) * 1000).getTime() - new Date(parseInt(timestamp[tnx - 1]) * 1000).getTime()) / 1000 / 60);
              }
            }
  
            if (data.result[tnx].contractAddress !== '') {
              createdContracts += 1;
              sentToContracts.push(data.result[tnx].contractAddress);
              valueSentContracts.push(parseInt(data.result[tnx].value) / 1000000000000000000);
            }
          }
  
            const totalTnx = sentTransactions + receivedTransactions + createdContracts;
            const totalEtherReceived = valueReceived.reduce((a, b) => a + b, 0);
            const totalEtherSent = valueSent.reduce((a, b) => a + b, 0);
            const totalEtherSentContracts = valueSentContracts.reduce((a, b) => a + b, 0);
            const totalEtherBalance = totalEtherReceived - totalEtherSent - totalEtherSentContracts
            const avgTimeBetweenSentTnx = avgTime(timeDiffSent)
            const avgTimeBetweenRecTnx = avgTime(timeDiffReceive)
            const [numUniqSentAddress, numUniqRecAddress] = uniq_addresses(sentToAddresses, receivedFromAddresses)
            const [minValReceived, maxValReceived, avgValReceived] = min_max_avg(valueReceived)
            const [minValSent, maxValSent, avgValSent] = min_max_avg(valueSent)
            const [minValSentContract, maxValSentContract, avgValSentContract] = min_max_avg(valueSentContracts)
            const timeDiffBetweenFirstAndLast = timeDiffFirstLast(timestamp)

            let transaction_fields = [avgTimeBetweenSentTnx, avgTimeBetweenRecTnx, timeDiffBetweenFirstAndLast,
                sentTransactions,
                receivedTransactions, createdContracts,
                numUniqRecAddress, numUniqSentAddress,
                minValReceived, maxValReceived, avgValReceived,
                minValSent, maxValSent, avgValSent,
                minValSentContract, maxValSentContract, avgValSentContract,
                totalTnx, totalEtherSent, totalEtherReceived, totalEtherSentContracts,
                totalEtherBalance]
                transaction_fields = transaction_fields.map((isStr:any)=> Number(isStr))
            return transaction_fields
        }
    }

const columns = ['Avg_min_between_sent_tnx', 'Avg_min_between_received_tnx',
'Time_Diff_between_first_and_last_(Mins)', 'Sent_tnx', 'Received_Tnx',
'Number_of_Created_Contracts', 'Unique_Received_From_Addresses',
'Unique_Sent_To_Addresses', 'min_value_received', 'max_value_received',
'avg_val_received', 'min_val_sent', 'max_val_sent', 'avg_val_sent',
'min_value_sent_to_contract', 'max_val_sent_to_contract',
'avg_value_sent_to_contract',
'total_transactions_(including_tnx_to_create_contract)',
'total_Ether_sent', 'total_ether_received',
'total_ether_sent_contracts', 'total_ether_balance', 'Total_ERC20_tnxs',
'ERC20_total_Ether_received', 'ERC20_total_ether_sent',
'ERC20_total_Ether_sent_contract', 'ERC20_uniq_sent_addr',
'ERC20_uniq_rec_addr', 'ERC20_uniq_sent_addr.1',
'ERC20_uniq_rec_contract_addr', 'ERC20_avg_time_between_sent_tnx',
'ERC20_avg_time_between_rec_tnx', 'ERC20_avg_time_between_rec_2_tnx',
'ERC20_avg_time_between_contract_tnx', 'ERC20_min_val_rec',
'ERC20_max_val_rec', 'ERC20_avg_val_rec', 'ERC20_min_val_sent',
'ERC20_max_val_sent', 'ERC20_avg_val_sent',
'ERC20_min_val_sent_contract', 'ERC20_max_val_sent_contract',
'ERC20_avg_val_sent_contract']

export const fetchData = async (normal_tx,token_tx,address_test) => {
   
    try {
      const [tokenTransferTransaction, normalTransaction, JSON_model]: any =
        await Promise.all([
          axios.get(
            `http://api.etherscan.io/api?module=account&action=tokentx&address=${address_test}&startblock=0&endblock=99999999&sort=asc&apikey=G4J9IVBGIUU38JX7NBFIB5VAQX4EMUK7VB`
          ),
          axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${address_test}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=G4J9IVBGIUU38JX7NBFIB5VAQX4EMUK7VB`
          ),
          axios.get(
            "https://res.cloudinary.com/dmaoo0uy0/raw/upload/v1678395204/transaction_history.json"
          ),
        ]);
      if (tokenTransferTransaction) {
        token_tx = token_transfer_transactions(
          address_test,
          tokenTransferTransaction.data
        );
      }
      if (normalTransaction) {
        normal_tx = normalTransactions(address_test, normalTransaction.data);
      }
      console.log("NORMAL", normal_tx);
      console.log("TOKEN", token_tx);
      const transactions = [...normal_tx, ...token_tx];
      // load model
      const xgb = new XGBoost()
      const model = xgb.load(JSON_model)
      const prediction = model.predict(transactions);
      console.log(prediction);
    
      
    } catch (e) {
      console.log(e);
    }
}