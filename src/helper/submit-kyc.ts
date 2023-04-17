export const submitKYC = async (
  data: any,
  validate: boolean,
  birthData: Date,
  expiryData: Date,
  gender: string,
  selectedFinancialInstitution: string
) => {
  if (validate) {
    console.log(data)
    let submission = {
      name:data.name,
      nationality:data.nationality,
      passportId:data.passport_id,
      birthDate: birthData.toISOString(),
      expiryDate: expiryData.toISOString(),
      gender: gender,
      selectedFinancialInstitution: selectedFinancialInstitution,
    };
    console.log(submission);
  }
};
