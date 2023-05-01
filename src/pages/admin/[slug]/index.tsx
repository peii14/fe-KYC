import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Card from "@/components/shared/Card";
import Table from "@/components/shared/Table";
import {
  getKYC,
  getPrivateData,
  postIllicitScore,
  rejectKYC,
} from "@/helper/assesment-kyc";
import { useEffect, useState } from "react";
import { getApprovedFinancialInstitutions } from "@/lib/kyc";
import { aprooveKYC } from "@/helper/assesment-kyc";
import { IoMdMore } from "react-icons/io";
import Dropdown from "@/components/shared/Dropdown";
import { toast } from "react-toastify";
import ModalPrivateData from "@/components/shared/modalPrivateData";
import { PrivateDataProps } from "@/types/privateData";
const Admin = ({ bank_entity, fi }) => {
  const [header, setHeader] = useState([]);
  const [values, setValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [financialInstitution, setFinancialInstitution] = useState(
    JSON.parse(fi)
  );
  const [privateData, setPrivateData] = useState<PrivateDataProps>();
  const [selectedFI, setSelectedFI] = useState(0);

  async function handlePrivateData(
    walletAddress: string,
    designatedBank: string,
    peerMSPID: string,
    setPrivateData: any
  ) {
    await toast.promise(
      getPrivateData(walletAddress, designatedBank, peerMSPID, setPrivateData),
      {
        pending: "Loading...",
        success: "Success!",
        error: "Error when fetching private data",
      }
    );

    setIsModalOpen(true);
  }

  const Edit = (props: any) => {
    const options = [
      {
        optionName: "Private Data",
        onClick: () =>
          handlePrivateData(
            props.props.walletAddress,
            props.props.designatedBank,
            financialInstitution[selectedFI]["mspid"],
            setPrivateData
          ),
      },
      {
        optionName: "AML Status",
        onClick: () =>
          postIllicitScore(
            props.props.designatedBank,
            props.props.walletAddress,
            financialInstitution[selectedFI]["mspid"]
          ),
      },
    ];
    return (
      <tr className="w-max">
        <td className="relative py-5 text-sm flex justify-between px-2 gap-3 items-center ">
          <button
            onClick={() =>
              aprooveKYC(props.props.designatedBank, props.props.walletAddress)
            }
            className="bg-green-600 hover:bg-green-800 duration-200 rounded-full px-5 py-1 w-max"
          >
            <p className="text-white">Accept</p>
          </button>
          <button
            onClick={() =>
              rejectKYC(props.props.designatedBank, props.props.walletAddress)
            }
            className="bg-red-500 hover:bg-red-800 duration-200 rounded-full px-5 py-1 w-max"
          >
            <p className="text-white">Reject</p>
          </button>
          <Dropdown options={options}>
            <IoMdMore />
          </Dropdown>
        </td>
      </tr>
    );
  };
  useEffect(() => {
    const getkyc = async () => {
      await toast.promise(getKYC(bank_entity, setValues, setHeader), {
        pending: "Loading...",
        success: "Success!",
        error: "Error when fetching KYC",
      });
    };
    getkyc();
    let index = -1;
    financialInstitution.forEach((d, i) => {
      if (d.institution === bank_entity) {
        index = i;
      }
    });
    setSelectedFI(index);
  }, [bank_entity, financialInstitution]);
  return (
    <>
      <Layout isAuth={true}>
        <Seo title="Bank Dashboard" />
        <main className="min-w-full mt-24">
          <section className="">
            <Card>
              <div className="overflow-x-hidden">
                <h1>Incoming Request</h1>
                <aside>
                  {header && values ? (
                    <Table
                      headers={header}
                      values={values}
                      isEdit={true}
                      Edit={Edit}
                      subtitle="Incoming Request to you"
                    />
                  ) : (
                    <></>
                  )}
                </aside>
              </div>
            </Card>
            <ModalPrivateData
              setIsOpen={setIsModalOpen}
              isOpen={isModalOpen}
              title="Customers Private Data"
              data={privateData}
            />
          </section>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const bank_entity = params.slug;
  const fi = await getApprovedFinancialInstitutions("SUPER-ADMIN");
  return {
    props: { bank_entity, fi },
  };
};

export default Admin;
