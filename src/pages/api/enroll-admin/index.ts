import { NextApiRequest, NextApiResponse } from "next";
import { enrollEntity} from "@/lib/enrolment";
export default function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    const { orgNumber, adminName,connection } = req.body;
    const enrolled = enrollEntity(orgNumber, adminName , connection);
    res.status(200).json({ success: true, data: enrolled });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}