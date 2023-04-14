import { NextApiRequest, NextApiResponse } from "next";
import {
  collectionConfig,
  getKycData,
  initLedger,
  submitKycData,
} from "@/lib/kyc";
import { instantiateChaincode } from "@/lib/instantiate";
import {
  decryptData,
  encryptDataForMultipleRecipients,
  getPublicECIES,
  getPrivateECIES,
  convertToBufferObject,
} from "@/helper/private_data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customer_entity, designated_bank, peerMSPID, kycData } = req.body;
  if (req.method === "GET") {
    const private_data = await getKycData(
      designated_bank,
      peerMSPID,
      customer_entity
    );
    const filePath = "../certs/" + designated_bank + ".json";
    const privateKey = await getPrivateECIES(filePath);
    const priv_ = convertToBufferObject(JSON.parse(private_data));
    const decryptedData = await decryptData(
      Buffer.from(privateKey, "base64"),
      priv_
    );
    res.status(200).json({ success: true, data: decryptedData });
  } else if (req.method === "POST") {
    // Read the file asynchronously
    const filePath = "../certs/" + designated_bank + ".json";

    const fi_pk = await getPublicECIES(filePath);
    const fi_buffer = Buffer.from(fi_pk, "base64");

    const encryptedData = await encryptDataForMultipleRecipients(
      fi_buffer,
      JSON.stringify(kycData)
    );

    await submitKycData(customer_entity, encryptedData, customer_entity);
    res.status(200).json({ success: true, data: encryptedData });
  } else if (req.method === "HEAD") {
    await initLedger(designated_bank);
    res.status(200).json({ success: true, message: "Chaincode instantiated" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
