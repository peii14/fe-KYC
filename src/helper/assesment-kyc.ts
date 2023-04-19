import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
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
    params: { bank_entity: designated_bank },
  });
  const request = JSON.parse(getRequest.data.data);
  setValues(extractWalletAddressAndRequest(request));
  
  setHeader(
    splitCamelCaseStrings(
      getAllKeys(request[0])
        .map((k) => k.split("."))
        .flat()
        .filter((key) => key !== "request")
        .concat(["AML Flag", "Edit"])
    )
  );
};
// TODO: GET kyc status of each customer
export const getKYCStatus = async () => {};
// TODO: POST kyc agreement
export const aprooveKYC = async () => {};
// TODO: POST kyc rejecton
export const rejectKYC = async () => {};
// TODO: PUT kyc revokation
export const revokeKYC = async () => {};
