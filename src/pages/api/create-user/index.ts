import { NextApiRequest,NextApiResponse } from "next";
import { createUserProfile } from "@/lib/kyc";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { userId, ethereumAddress } = req.body;
            const result = await createUserProfile(userId, ethereumAddress);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}