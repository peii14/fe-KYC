import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/shared/Card";
import axios from "axios";
import Table from "@/components/shared/Table";

const Transaction = ({ wallet_address, transaction_history }) => {
  const { address } = useWeb3();
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);
  const header = Object.keys(transaction_history.result[0]).slice(0, 10);
  const values = Object.values(transaction_history.result);
  console.log(values);
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
              <div>
                <Table headers={header} values={values} isEdit={false} />
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
  // get transaction history
  const transaction_history = await axios.get(
    `https://api.etherscan.io/api?module=account&action=txlist&address=0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`
  );

  return {
    props: { wallet_address, transaction_history: transaction_history.data },
  };
};
export default Transaction;
