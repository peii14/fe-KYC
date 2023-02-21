import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/shared/Card";
const Transaction = ({ wallet_address }) => {
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
        <Seo title="Transaction History" />
        <main className="mt-24">
          <section>
            <Card>
              <h1>Transaction History</h1>
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
export default Transaction;
