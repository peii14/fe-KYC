import { addApprovedFinancialInstitution,getApprovedFinancialInstitutions, removeApprovedFinancialInstitution } from "@/lib/kyc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === 'POST'){
        const {financialInstitution, mspid} = req.body;
        const fi = await addApprovedFinancialInstitution(financialInstitution, mspid)
        res.status(200).json({success:true,data:fi});
    }
    else if(req.method === 'GET'){
        const fi = await getApprovedFinancialInstitutions()
        res.status(200).json({success:true,data:fi});
    }
    else if (req.method === 'DELETE'){
        const {financialInstitution, mspid} = req.body;
        const fi = await removeApprovedFinancialInstitution(financialInstitution,mspid)
    }
    else{
        res.status(405).json({success:false,message:'Method not allowed'});
    }
}