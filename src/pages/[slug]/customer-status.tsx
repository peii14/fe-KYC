import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/shared/Card";
import { BsFillPatchCheckFill } from "react-icons/bs";
const Customer = ({ wallet_address }) => {
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
                  <p>Validation by {}</p>
                </div>
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
  return {
    props: { wallet_address },
  };
};
export default Customer;
