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
  const { customer_entity, designated_bank } = req.body;
  if (req.method === "POST") {
    const timestamp = new Date().toISOString();
    const request = await requestValidation(
      designated_bank,
      timestamp,
      customer_entity
    );
    res.status(200).json({ success: true, data: request });
  } else if (req.method === "GET") {
    const mode = req.query.mode.toString();
    if (mode === "customer") {
      const kycStatus = await getRequestValidation(
        customer_entity,
        customer_entity
      );
      res.status(200).json({ success: true, data: kycStatus });
    } else if (mode === "bank") {
      const bank_entity = req.query.bank_entity.toString();
      const kycStatus = await getRequstByDesignatedBank(bank_entity);
      res.status(200).json({ success: true, data: kycStatus });
    } else {
      res.status(405).json({ success: false, message: "Wrong mode" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
