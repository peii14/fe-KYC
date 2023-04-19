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
const Admin = ({ fi }) => {
  const [header, setHeader] = useState([]);
  const [values, setValues] = useState([]);
  const [financialInstitution, setFinancialInstitution] = useState(
    JSON.parse(fi)
  );
  const [privateData, setPrivateData] = useState([]);
  const [selectedFI, setSelectedFI] = useState(0);
  const Edit = (props: any) => {
    return (
      <tr className="w-max ">
        <td className="py-5 text-sm grid grid-cols-2 gap-3 items-center ">
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
          {/* TODO:Display private data */}
          <button
            onClick={() =>
              getPrivateData(
                props.props.walletAddress,
                props.props.designatedBank,
                financialInstitution[selectedFI]["mspid"],
                setPrivateData
              )
            }
            className="col-span-2 bg-red-500 hover:bg-red-800 duration-200 rounded-full px-5 py-1 w-max"
          >
            <p className="text-white">View Private Data</p>
          </button>
          <button
            onClick={() =>
              postIllicitScore(
                props.props.designatedBank,
                props.props.walletAddress,
                financialInstitution[selectedFI]["mspid"]
              )
            }
            className="bg-red-500 hover:bg-red-800 duration-200 rounded-full px-5 py-1 w-max"
          >
            <p className="text-white">Refresh AML Status</p>
          </button>
        </td>
      </tr>
    );
  };
  useEffect(() => {
    // TODO: admin auth
    getKYC("BCA", setValues, setHeader);
    let index = -1;
    financialInstitution.forEach((d, i) => {
      if (d.institution === "BCA") {
        index = i;
      }
    });
    setSelectedFI(index);
  }, [financialInstitution]);
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
          </section>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const fi = await getApprovedFinancialInstitutions("SUPER-ADMIN");
  return {
    props: { fi },
  };
};

export default Admin;
