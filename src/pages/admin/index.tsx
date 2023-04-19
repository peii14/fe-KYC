import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Card from "@/components/shared/Card";
import Table from "@/components/shared/Table";
import { getKYC } from "@/helper/assesment-kyc";
import { useEffect, useState } from "react";
const Admin = () => {
  const [header, setHeader] = useState([]);
  const [values, setValues] = useState([]);
  const Edit = () => {
    return (
      <tr className="w-max ">
        <td className="py-5 text-sm grid grid-cols-2 gap-3 items-center ">
          <button className="bg-green-600 hover:bg-green-800 duration-200 rounded-full px-5 py-1 w-max">
            <p className="text-white">Accept</p>
          </button>
          <button className="bg-red-500 hover:bg-red-800 duration-200 rounded-full px-5 py-1 w-max">
            <p className="text-white">Reject</p>
          </button>
          <button className="col-span-2 bg-red-500 hover:bg-red-800 duration-200 rounded-full px-5 py-1 w-max">
            <p className="text-white">View Private Data</p>
          </button>
          <button className="bg-red-500 hover:bg-red-800 duration-200 rounded-full px-5 py-1 w-max">
            <p className="text-white">Refresh AML Status</p>
          </button>
        </td>
      </tr>
    );
  };
  useEffect(() => {
    // TODO: admin auth
    getKYC("BCA", setValues, setHeader);
    // TODO: post method to check transaction history
  }, []);
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

export default Admin;
