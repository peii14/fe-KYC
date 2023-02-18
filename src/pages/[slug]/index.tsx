import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { useWeb3 } from "@3rdweb/hooks";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";

const Customer = ({ wallet_address }) => {
  const [isAuth, setAuth] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!wallet_address) {
      router.push("/");
    } else {
      setAuth(true);
    }
  }, [wallet_address, router]);
  return (
    <>
      <Layout isAuth={isAuth}>
        <Seo title="Customer dashboard" />
        <main className="w-full min-h-screen mt-24">
          <p>{wallet_address}</p>
        </main>
      </Layout>
    </>
  );
};
export const getServerSideProps = async ({ params }) => {
  const wallet_address = params.slug;
  return {
    props: { wallet_address },
  };
};
export default Customer;
