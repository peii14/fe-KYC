import { NextApiRequest, NextApiResponse } from 'next';
import { getKycData, submitKycData } from '@/lib/kyc';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const entity = req.query.entity.toString();
    const { walletAddress, kycData } = req.body;
    if(req.method === 'GET'){
        const private_data = await getKycData(walletAddress ,entity);
        res.status(200).json({success:true,data:private_data});
    }else if(req.method === 'POST'){
        const private_data = await submitKycData(walletAddress, kycData,entity);
        res.status(200).json({success:true,data:private_data});
    }else{
        res.status(405).json({success:false,message:'Method not allowed'});
    }
}