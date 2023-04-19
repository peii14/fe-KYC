import axios from "axios";
export const submitKYC = async (
  data: any,
  validate: boolean,
  birthData: Date,
  expiryData: Date,
  gender: string,
  selectedFinancialInstitution: any,
  biometrics: any,
  mrz: any,
  walletAddress: string
) => {
  if (validate) {
    // create user
    await axios.post("/api/create-user", {
      userId: walletAddress,
      ethereumAddress: walletAddress,
      admin: selectedFinancialInstitution.institution,
    });
    // enroll user
    await axios.post("/api/enroll-customer", {
      orgNumber: selectedFinancialInstitution.mspid.match(/\d+/g)?.[0] || "",
      customerId: walletAddress,
      adminName: selectedFinancialInstitution.institution,
      customerSecret: "adminpw",
    });

    let submission = {
      name: data.name,
      nationality: data.nationality,
      passportId: data.passport_id,
      birthDate: birthData.toISOString(),
      expiryDate: expiryData.toISOString(),
      gender: gender,
      selectedFinancialInstitution: selectedFinancialInstitution,
      biometrics: biometrics,
      mrz: mrz,
    };

    const [privateData, kycValidation] = await Promise.all([
      axios.post("/api/private-data", {
        customer_entity: walletAddress,
        designated_bank: selectedFinancialInstitution.institution,
        peerMSPID: selectedFinancialInstitution.mspid,
        kycData: submission,
      }),
      axios.post("/api/kyc-validation?mode=customer", {
        customer_entity: walletAddress,
        designated_bank: selectedFinancialInstitution.institution,
      }),
    ]);
    return [privateData, kycValidation];
  }
};
