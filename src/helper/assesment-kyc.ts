import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
  extractValues,
  extractWalletAddressAndRequest,
  getAllKeys,
  splitCamelCaseStrings,
} from "./getAllKeys";
// TODO: Get kyc assesment of each bank
export const getKYC = async (
  designated_bank: string,
  setValues: Dispatch<SetStateAction<any>>,
  setHeader: Dispatch<SetStateAction<any>>
) => {
  const getRequest = await axios.get("/api/kyc-validation?mode=bank", {
    params: { bank_entity: designated_bank, query: "all" },
  });
  const request = JSON.parse(getRequest.data.data);
  setValues(extractWalletAddressAndRequest(request));

  setHeader(
    splitCamelCaseStrings(
      getAllKeys(request[0])
        .map((k) => k.split("."))
        .flat()
        .filter((key) => key !== "request")
        .concat(["Action"])
    )
  );
};
// TODO: GET accepted Request
export const getAcceptedRequest = async (
  designated_bank: string,
  peerMSPID: string,
  setValues: Dispatch<SetStateAction<any>>,
  setHeader: Dispatch<SetStateAction<any>>
) => {
  const getRequest = await axios.get("/api/kyc-validation?mode=bank", {
    params: {
      bank_entity: designated_bank,
      query: "accepted",
      peerMSPID: peerMSPID,
    },
  });
  const request = JSON.parse(getRequest.data.data);
  setValues(extractValues(request));
  setHeader(
    splitCamelCaseStrings(
      getAllKeys(request[0])
        .map((k) => k.split("."))
        .flat()
        .filter((key) => key !== "request")
        .concat(["Action"])
    )
  );
};
// TODO: GET kyc status of each customer
export const getKYCStatus = async (wallet_address: string) => {
  const getRequest = await axios.get("/api/kyc-validation?mode=customer", {
    params: { customer_entity: wallet_address },
  });
  const request = JSON.parse(getRequest.data.data);
  return request;
};
// TODO: POST kyc agreement
export const aprooveKYC = async (
  designated_bank: string,
  customer_address: string
) => {
  const postRequest = await axios.put("/api/kyc-validation", {
    designated_bank: designated_bank,
    timestamp: new Date().toISOString(),
    customer_entity: customer_address,
    mode: "accept",
  });
  const request = JSON.parse(postRequest.data.data);
  return request;
};
// TODO: POST kyc rejecton
export const rejectKYC = async (
  designated_bank: string,
  customer_address: string
) => {
  const postRequest = await axios.put("/api/kyc-validation", {
    designated_bank: designated_bank,
    timestamp: new Date().toISOString(),
    customer_entity: customer_address,
    mode: "reject",
  });
  const request = JSON.parse(postRequest.data.data);
  return request;
};
// TODO: PUT kyc revokation
export const revokeKYC = async () => {};
// TODO: POST Illicit score
export const postIllicitScore = async (
  designated_bank: string,
  customer_address: string,
  peerMSPID: string
) => {
  const illicit = await axios.get(
    `http://127.0.0.1:8080/predict?address=${customer_address}`
  );
  const update = await axios.put("/api/kyc-validation", {
    designated_bank: designated_bank,
    peerMSPID: peerMSPID,
    customer_entity: customer_address,
    mode: "AML",
    illicit: illicit.data.prediction === 1 ? "Illicit" : "Legitimate",
  });
  return update;
};
