import {
  validateRequestValidation,
  getAcceptedRequestsByBank,
  getRequestValidation,
  getRequstByDesignatedBank,
  requestValidation,
  illicitActivities,
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
      const { bank_entity, peerMSPID, query } = req.query;
      if (query === "all") {
        const kycStatus = await getRequstByDesignatedBank(
          bank_entity.toString()
        );
        res.status(200).json({ success: true, data: kycStatus });
      } else if (query === "accepted") {
        const kycStatus = await getAcceptedRequestsByBank(
          bank_entity.toString(),
          peerMSPID.toString()
        );
        res.status(200).json({ success: true, data: kycStatus });
      } else {
        res.status(405).json({ success: false, message: "Wrong mode" });
      }
    }
  } else if (req.method === "PUT") {
    const {
      designated_bank,
      timestamp,
      customer_entity,
      mode,
      illicit,
      peerMSPID,
    } = req.body;
    if (mode === "accept") {
      const accept = await validateRequestValidation(
        designated_bank.toString(),
        timestamp.toString(),
        customer_entity.toString(),
        "accepted"
      );
      res.status(200).json({ success: true, data: accept });
    } else if (mode === "reject") {
      const accept = await validateRequestValidation(
        designated_bank.toString(),
        timestamp.toString(),
        customer_entity.toString(),
        "reject"
      );
      res.status(200).json({ success: true, data: accept });
    } else if (mode === "revoke") {
      const accept = await validateRequestValidation(
        designated_bank.toString(),
        timestamp.toString(),
        customer_entity.toString(),
        "revoked"
      );
      res.status(200).json({ success: true, data: accept });
    } else if (mode === "AML") {
      const activities = await illicitActivities(
        designated_bank.toString(),
        peerMSPID.toString(),
        illicit.toString(),
        customer_entity.toString()
      );
      res.status(200).json({ success: true, data: activities });
    } else {
      res.status(405).json({ success: false, message: "Wrong mode" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
