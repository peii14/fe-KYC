import {
  getRequestValidation,
  getRequstByDesignatedBank,
  requestValidation,
} from "@/lib/kyc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customer_entity, bank_entity, designated_bank } = req.body;
  if (req.method === "POST") {
    const request = await requestValidation(designated_bank, customer_entity);
    res.status(200).json({ success: true, data: request });
  } else if (req.method === "GET") {
    const mode = req.query.mode.toString();
    if (mode === "customer") {
      const kycStatus = await getRequestValidation(
        customer_entity,
        bank_entity,
        customer_entity
      );
      res.status(200).json({ success: true, data: kycStatus });
    } else if (mode === "bank") {
      const kycStatus = await getRequstByDesignatedBank(bank_entity);
      res.status(200).json({ success: true, data: kycStatus });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
