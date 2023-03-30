import { addApprovedFinancialInstitution,getApprovedFinancialInstitutions } from "@/lib/kyc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === 'POST'){
        const {financialInstitution, mspid} = req.body;
        const enrolled = await addApprovedFinancialInstitution(financialInstitution, mspid)
        res.status(200).json({success:true,data:enrolled});
    }
    else if(req.method === 'GET'){
        const enrolled = await getApprovedFinancialInstitutions()
        res.status(200).json({success:true,data:enrolled});
    }
    else{
        res.status(405).json({success:false,message:'Method not allowed'});
    }
}