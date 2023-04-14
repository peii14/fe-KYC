import { NextApiRequest, NextApiResponse } from "next";
import { enrollAdmin } from "@/lib/enrolment";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { orgNumber, adminName } = req.body;
    await enrollAdmin(orgNumber, adminName);
    // await registerAdmin(orgNumber, adminName);
    res.status(200).json({ success: true, data: "Admin enrolled" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
