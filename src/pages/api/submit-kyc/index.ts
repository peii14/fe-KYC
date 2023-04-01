import { submitKycData } from '@/lib/kyc';
import { Identity } from '@tensorflow/tfjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { customerId, kycData } = req.body;
      const result = await submitKycData(customerId, Identity,kycData);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
