import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Button from "@/components/button";
import { BsFillPeopleFill, BsBank2 } from "react-icons/bs";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { useForm } from "react-hook-form";
import Input from "@/components/shared/Input";
export default function Home() {
  const [isCustomer, setCustomer] = useState(false);
  const [isBankEntity, setBankEntity] = useState(false);

  const [landingHeight, setLandingHeight]: any = useState("auto");
  const [bankHeight, setBankHeight]: any = useState(0);
  useEffect(() => {}, [isCustomer]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  }: any = useForm();
  const submitHandler = async ({
    email,
    password,
  }: {
    readonly email: string;
    readonly password: string;
  }) => {
    try {
    } catch (err) {}
  };

  return (
    <>
      <Layout>
        <Seo title="KYC" />
        <section className="h-screen grid grid-cols-2 items-center">
          <div className={`w-2/3 mx-auto `}>
            <h1 className="text-6xl">Welcome back</h1>
            <p className="text-gray-600">
              A localize verification KYC process base on hyper-ledger fabric.
            </p>
            <AnimateHeight
              id="landing-panel"
              duration={500}
              height={landingHeight}
            >
              <div className="mt-3">
                <h3 className="font-semibold">Log in as</h3>
                <div className="flex flex-col my-5 space-y-2">
                  <Button type={1}>
                    <BsFillPeopleFill />
                    <p>Customer</p>
                  </Button>
                  <p className="text-center text-lg">or</p>
                  <Button
                    type={1}
                    onClick={() => {
                      setBankEntity(true);
                      setLandingHeight(0);
                      setBankHeight("auto");
                    }}
                  >
                    <BsBank2 />
                    <p>Bank Entity</p>
                  </Button>
                </div>
              </div>
            </AnimateHeight>
            <AnimateHeight
              id="admin-panel"
              duration={500}
              delay={500}
              height={bankHeight}
            >
              <form onSubmit={handleSubmit(submitHandler)} className="mt-5">
                <Input
                  placeholder={"name@company.com"}
                  entity="email"
                  label="Email address"
                  patern={{
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  }}
                  errors={errors}
                  register={register}
                />
                <Input
                  className="mt-3"
                  placeholder={"**********"}
                  entity="password"
                  label="Password"
                  patern={{
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  }}
                  errors={errors}
                  register={register}
                />
                <Button className="mt-5" type={1}>
                  <p>Log in</p>
                </Button>
              </form>
            </AnimateHeight>
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
