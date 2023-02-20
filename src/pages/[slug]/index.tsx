import Button from "@/components/button";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { useWeb3 } from "@3rdweb/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineNavigateNext } from "react-icons/md";
import { AiFillFileAdd } from "react-icons/ai";
import AnimateHeight from "react-animate-height";
import Webcam from "react-webcam";
import Image from "next/image";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { useDropzone } from "react-dropzone";
import BinaryPicker from "@/components/shared/BinaryPicker";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};
const Customer = ({ wallet_address }) => {
  const [files, setFiles] = useState([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  const [isAuth, setAuth] = useState(false);
  const { address } = useWeb3();
  const router = useRouter();

  const [documentHeight, setDocHeigth]: any = useState("auto");
  const [verificationHeight, setVerHeigth]: any = useState(0);
  const [birthDate, setBirthDate] = useState(new Date());
  const [passportDate, setPassportDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [isCameraStart, setCameraStart] = useState(false);
  const [toValidate, setValidate] = useState(false);
  const thumbs = files.map((file) => (
    <div className="w-full" key={file.name}>
      <Image
        alt="passport"
        src={file.preview}
        className="object-cover mx-auto mt-1"
        width={420}
        height={500}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));
  const {
    handleSubmit,
    register,
    formState: { errors },
  }: any = useForm();
  useEffect(() => {
    if (wallet_address != address) {
      router.push("/");
    } else {
      setAuth(true);
    }
  }, [wallet_address, router, address]);
  useEffect(() => {
    if (toValidate) {
      setDocHeigth(0);
      setVerHeigth("auto");
    } else {
      setDocHeigth("auto");
      setVerHeigth(0);
    }
  }, [toValidate]);
  return (
    <>
      <Layout isAuth={isAuth}>
        <Seo title="Customer dashboard" />
        <main className="min-w-full mt-24">
          <section className="">
            <Card>
              <div className="flex justify-between items-center">
                <div className="h-10 overflow-y-hidden">
                  <h1
                    className={`duration-200 ${
                      toValidate ? "-translate-y-full" : ""
                    }`}
                  >
                    New Customer
                  </h1>
                  <h1
                    className={`duration-200 ${
                      toValidate ? "-translate-y-full" : ""
                    }`}
                  >
                    Verification
                  </h1>
                </div>
                <p>Customer Registration Form (New Customers Only)</p>
              </div>
              <AnimateHeight
                id="document-panel"
                duration={500}
                delay={toValidate ? 0 : 500}
                height={documentHeight}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-5 mt-10">
                  <Input
                    label="Name"
                    entity="name"
                    errors={errors}
                    register={register}
                    placeholder={"John Doe"}
                  />
                  <Input
                    label="Nationality"
                    entity="nationality"
                    errors={errors}
                    register={register}
                    placeholder={"Indonesia"}
                  />
                  {/* change to DOB */}
                  <div>
                    <p>Date of birth</p>
                    <div className="px-3 py-2 my-2 w-full border-2 rounded-lg">
                      <DatePicker
                        selected={birthDate}
                        onChange={(date) => setBirthDate(date)}
                      />
                    </div>
                  </div>
                  <Input
                    label="Passport ID"
                    entity="passport_id"
                    errors={errors}
                    register={register}
                    placeholder={"X9281028"}
                  />
                  {/* change to male or female only */}
                  <div>
                    <p className="mb-3">Gender</p>
                    <BinaryPicker />
                  </div>
                  {/* datepicker */}
                  <div>
                    <p>Passport expiry date</p>
                    <div className="px-3 py-2 my-2 w-full border-2 rounded-lg">
                      <DatePicker
                        selected={passportDate}
                        onChange={(date) => setPassportDate(date)}
                      />
                    </div>
                  </div>
                </div>
              </AnimateHeight>
              <AnimateHeight
                id="verification-panel"
                duration={500}
                delay={toValidate ? 500 : 0}
                height={verificationHeight}
              >
                <div className="grid grid-cols-2 gap-5 mt-10">
                  <div>
                    <p>Choose your passport</p>
                    <section className="cursor-pointer text-center w-full bg-gray-200 border-2 border-dashed border-dark p-5 mt-5">
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>
                          Drag n drop some files here, or click to select files
                        </p>
                      </div>
                      <aside>{thumbs}</aside>
                    </section>
                  </div>
                  <div>
                    <p className="mb-5">Live selfies</p>
                    <div
                      className={`w-full border-2 p-1 border-red-700 h-[310px] flex items-center`}
                    >
                      {isCameraStart ? (
                        <>
                          <Webcam
                            audio={false}
                            height={720}
                            // ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                          />
                        </>
                      ) : (
                        <>
                          <div className="w-1/2 mx-auto">
                            <Button
                              className="m-auto"
                              type={1}
                              onClick={() => setCameraStart(true)}
                            >
                              <p>Start Camera</p>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateHeight>
            </Card>
          </section>

          <div
            className={`items-center py-10 flex flex-row relative overflow-x-hidden px-3  ${
              toValidate ? " justify-between gap-10" : ""
            }`}
          >
            <div className={` duration-700 ${toValidate ? "w-56" : " w-full"}`}>
              <Button
                type={toValidate ? 2 : 1}
                className={` h-14 `}
                onClick={() => {
                  setValidate(!toValidate);
                }}
              >
                <MdOutlineNavigateNext
                  className={`text-2xl duration-300 ${
                    toValidate ? "rotate-180" : ""
                  }`}
                />
                <p className={` ${toValidate ? "w-0 hidden" : ""}`}>
                  To verify
                </p>
                <p className={`${toValidate ? "" : "hidden"}`}>Back</p>
              </Button>
            </div>
            <div className={``}>
              <Button
                type={1}
                className={`h-14 duration-700 max-w-xs w-60 ${
                  toValidate
                    ? ""
                    : "right-0 translate-x-full -translate-y-1/2 top-1/2 absolute"
                }`}
                onClick={() => {
                  setValidate(true);
                }}
              >
                <AiFillFileAdd className="text-xl" />
                <p>Request verification</p>
              </Button>
            </div>
          </div>
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
