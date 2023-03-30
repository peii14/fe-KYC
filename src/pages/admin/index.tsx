import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";

const Admin = () => {
  return (
    <>
      <Layout isAuth={true}>
        <Seo title="Bank Dashboard" />
        <main className="min-w-full mt-24"></main>
      </Layout>
    </>
  );
};
export default Admin;
