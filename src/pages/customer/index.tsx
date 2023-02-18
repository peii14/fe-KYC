import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { useWeb3 } from "@3rdweb/hooks";
import { Router, useRouter } from "next/router";
import { useEffect } from "react";

const Customer = () => {
  const { address } = useWeb3();
  const router = useRouter();
  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);
  return (
    <>
      <Layout>
        <Seo title="Customer dashboard" />
        <main>
          <p>{address}</p>
        </main>
      </Layout>
    </>
  );
};
export default Customer;
