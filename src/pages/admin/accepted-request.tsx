import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Card from "@/components/shared/Card";
import Table from "@/components/shared/Table";
const Accepted = () => {
  const header = [
    "Request ID",
    "Requested on",
    "End of Passport Validity",
    "AML Score",
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
                <h1>Accepted Request</h1>
                <aside>
                  <Table
                    headers={header}
                    values={values}
                    isEdit={false}
                    subtitle="Accepted KYC Request"
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
export default Accepted;
