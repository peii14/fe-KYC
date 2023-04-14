import { enrollCustomer} from "@/lib/enrolment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { orgNumber, customerId, adminName, customerSecret } = req.body;
    const enrolled = await enrollCustomer(
      orgNumber,
      customerId,
      adminName,
      customerSecret
    );
    res.status(200).json({ success: true, data: enrolled });
  }  else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
