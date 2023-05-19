import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/shared/Card";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { getUserProfile } from "@/lib/kyc";
import CustomerStatus from "@/components/status/CustomerStatus";
import AMLStatus from "@/components/status/AMLStatus";

interface CustomerProps {
  wallet_address: string;
  userInformation: UserInformation;
}
interface UserInformation {
  AMLFlag: string;
  designatedBank: string;
  status: string;
  timestamp: string;
}

const Customer = ({ wallet_address, userInformation }: CustomerProps) => {
  const { address } = useWeb3();
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    if (wallet_address != address) {
      router.push("/");
    } else {
      setAuth(true);
    }
  }, [wallet_address, router, address]);
  return (
    <>
      <Layout isAuth={isAuth}>
        <Seo title="Customer Status" />
        <main className="mt-24">
          <section>
            <Card>
              <div className="flex justify-between items-center">
                <h1>View Customer Status</h1>
                <div className="flex items-center space-x-2">
                  <BsFillPatchCheckFill />
                  <p>Validation by {userInformation.designatedBank}</p>
                </div>
              </div>
              <div className="mt-5 gap-5 grid grid-cols-2">
                <p>Customer Status</p>
                <CustomerStatus status={userInformation.status} />
                <p>AML Flag</p>
                <AMLStatus status={userInformation.AMLFlag} />
                <p>Timestamp</p>
                <p>{new Date(userInformation.timestamp).toString()}</p>
              </div>
            </Card>
          </section>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const wallet_address = params.slug;
  // check wallet address
  const user = await getUserProfile(wallet_address, wallet_address);
  console.log(user);
  return {
    props: { wallet_address, userInformation: JSON.parse(user) },
  };
};
export default Customer;
