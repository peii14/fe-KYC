import { addApprovedFinancialInstitution,getApprovedFinancialInstitutions, removeApprovedFinancialInstitution } from "@/lib/kyc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const {financialInstitution, mspid} = req.body;
    const identity = req.query.identity.toString();
    if(req.method === 'POST'){
        const fi = await addApprovedFinancialInstitution(financialInstitution,identity, mspid)
        res.status(200).json({success:true,data:fi});
    }
    else if(req.method === 'GET'){
        const fi = await getApprovedFinancialInstitutions(identity)
        res.status(200).json({success:true,data:fi});
    }
    else if (req.method === 'DELETE'){
        const fi = await removeApprovedFinancialInstitution(financialInstitution,identity,mspid)
        res.status(200).json({success:true,data:fi});
    }
    else{
        res.status(405).json({success:false,message:'Method not allowed'});
    }
}