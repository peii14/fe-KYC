import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Card from "@/components/shared/Card";
import Table from "@/components/shared/Table";
const Admin = () => {
  const header = [
    "Request ID",
    "Wallet Address",
    "Requested on",
    "AML",
    "Action",
  ];
  const values = [{}];
  return (
    <>
      <Layout isAuth={true}>
        <Seo title="Bank Dashboard" />
        <main className="min-w-full mt-24">
          <section className="">
            <Card>
              <div className="">
                <h1>Incoming Request</h1>
                <aside>
                  <Table
                    headers={header}
                    values={values}
                    isEdit={false}
                    subtitle="Incoming Request to you"
                  />
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
