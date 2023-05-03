import axios from "axios";
import { toast } from "react-toastify";
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
    await toast.promise(
      axios.post("/api/create-user", {
        userId: walletAddress,
        ethereumAddress: walletAddress,
        admin: selectedFinancialInstitution.institution,
      }),
      {
        pending: "Creating user...",
        success: "User created!",
        error: "Error creating user",
      }
    );
    // enroll user
    await toast.promise(
      axios.post("/api/enroll-customer", {
        orgNumber: selectedFinancialInstitution.mspid.match(/\d+/g)?.[0] || "",
        customerId: walletAddress,
        adminName: selectedFinancialInstitution.institution,
        customerSecret: "adminpw",
      }),
      {
        pending: "Enrolling user...",
        success: "User enrolled!",
        error: "Error enrolling user",
      }
    );

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

    const [privateData, kycValidation] = await toast.promise(
      Promise.all([
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
      ]),
      {
        pending: "Submitting KYC...",
        success: "KYC submitted!",
        error: "Error submitting KYC",
      }
    );
    return [privateData, kycValidation];
  }
};
