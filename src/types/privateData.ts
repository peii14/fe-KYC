import { mrzProps } from "./mrz";
export interface PrivateDataProps {
  readonly name: string;
  readonly nationality: string;
  readonly passportId: string;
  readonly birthDate: string;
  readonly expiryDate: string;
  readonly gender: string;
  readonly selectedFinancialInstitution: { institution: string; mspid: string };
  readonly biometrics: [
    { live: Object },
    { passport: { lable: string; descriptors: Object } }
  ];
  readonly mrz: mrzProps;
}
