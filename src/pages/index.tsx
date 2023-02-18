import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Button from "@/components/button";
import { BsFillPeopleFill, BsBank2 } from "react-icons/bs";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Layout>
        <Seo title="KYC" />
        <section className="h-screen grid grid-cols-2 items-center">
          <div className="w-2/3 mx-auto">
            <h1 className="text-6xl">Welcome back</h1>
            <p className="text-gray-600">
              A localize verification of KYC base on hyper-ledger fabric.
            </p>
            <div className="mt-3">
              <h3 className="font-semibold">Log in as</h3>
              <div className="flex flex-col my-5 space-y-2">
                <Button type={1}>
                  <BsFillPeopleFill />
                  <p>Customer</p>
                </Button>
                <p className="text-center text-lg">or</p>
                <Button type={1}>
                  <BsBank2 />
                  <p>Bank Entity</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full relative h-screen ">
            <Image
              className="p-10"
              src="/img/cover.jpg"
              alt="Cover"
              sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
              fill
            />
          </div>
        </section>
      </Layout>
    </>
  );
}
