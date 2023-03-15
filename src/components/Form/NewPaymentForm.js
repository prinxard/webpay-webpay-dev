import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import SectionTitle from "../section-title";
import Widget from "../widget";
import { NewFormInput } from "../FormInput/formInputs";
import axios from "axios";
import Loader from "react-loader-spinner";
import { SubmitButton } from "../CustomButton/CustomButton";
import url from "../../config/url";
import { useRouter } from "next/router";
import { FiSend } from "react-icons/fi";
import { formatNumber } from "../../functions/numbers";
import Spinner from "../spiner";
import { v4 as uuidv4 } from "uuid";
import { taxStation } from "../../json/taxOffice";
import UseFetcher from "../fetcher/useFetcher";
import { saveAs } from "file-saver";
const NewPaymentForm = () => {
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { data, isLoading, isError } = UseFetcher(
    `${url.BASE_URL}user/new-payment`
  );

  const [modalData, setModalData] = useState(() => []);
  const [channel, setChannel] = useState([
    { key: "WebPay", value: "Interswitch" },
    { key: "Bank", value: "Bank" },
    { key: "Remita", value: "Remita" },
    { key: "eTransact", value: "eTransact" },
  ]);

  const [loadingState, setLoadingState] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [item, setItem] = useState(() => []);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const show = () => {
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
  };

  const mySet = new Set();
  for (let i = 0; i < data?.revenueSub.length; i++) {
    const e = data.revenueSub[i];
    mySet.add(e.mda);
  }

  let dataArray;
  if (data) {
    dataArray = data.revenueSub;
  }
  let arr = [...mySet];
  const filterItem = (e) => {
    let da = e.target.value;
    const itemName = data.revenueSub.filter((md) => md.mda === da);
    setItem(() => itemName);

    const filteredChannel = channel.filter(
      (channel) => channel.key !== "Remita"
    );
    if (da !== "INTERNAL REVENUE SERVICE") {
      setChannel(filteredChannel);
    } else {
      setChannel(() => [
        ...filteredChannel,
        { key: "Remita", value: "Remita" },
      ]);
    }
  };

  //submit handler
  const SubmitHandler = (data) => {
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    if (month < 10) {
      month = `0${month}`;
    }
    const date = `${year}-${month}-${day}`;
    const ref = `${year}${month}${day}${Date.now()}`;
    data.ref = ref;
    data.assessmentId = `NEW-${ref}`;

    data.transactionDate = date;
    const agency = data.revenueItem.split("/")[0];
    data.agency = agency;
    data.itemName = dataArray?.filter(
      (mda) => mda.rev_code === data.revenueItem
    )[0].item;
    let myArr = [];
    myArr.push(data);
    setModalData(() => myArr);
    show();
  };

  const submit = async (data) => {
    setLoadingState("Submitting...");
    setLoading(true);
    try {
      const res = await axios.post(`${url.BASE_URL}payment/new-payment`, {
        transactionDate: data.transactionDate,
        agency: data.agency,
        revenueSub: data.revenueItem,
        taxPayer: data.KGTIN,
        amount: data.amount,
        station: data.taxOffice,
        status: "2",
        ref: data.ref,
        paymentMethod: data.channel,
        assessmentId: data.assessmentId,
        name: data.name,
        phone: data.phoneNumber,
        email: data.email,
      });

      if (res.data.status === 200) {
        if (data.channel === "Remita") {
          router.push(
            `${url.PAY_URL}remita/initialize.php?assessmentId=${data.assessmentId}&taxId=${data.KGTIN}`
          );
        } else if (data.channel === "eTransact") {
          router.push(
            `${url.PAY_URL}etransact/initialize.php?assessmentId=${data.assessmentId}&taxId=${data.KGTIN}`
          );
        } else if (data.channel === "WebPay") {
          router.push(
            `${url.PAY_URL}interswitch/initialize.php?assessmentId=${data.assessmentId}&taxId=${data.KGTIN}`
          );
        } else if (data.channel === "Bank") {
          setLoadingState("Generating Pdf...");
          await fetchBankPrint(data.ref);
        }
      }
    } catch (e) {
      setLoading(false);
      setLoadingState("");
      console.log(e);
      if (e.response) {
        console.log(e.response);
      }
    }
  };
  //get bank print
  const fetchBankPrint = async (ref) => {
    try {
      const res = await axios.get(`${url.BASE_URL}user/bank-print/${ref}`, {
        responseType: "blob",
      });
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, `${ref}__bankPrint.pdf`);
      setLoading(false);
      setLoadingState("");
      setPdfMessage(
        "Pdf successfully generated. Tender this at the bank to process payment"
      );
      setTimeout(() => {
        setPdfMessage("");
        router.push("/payment/pending-invoice");
      }, 6000);
    } catch (err) {
      alert("Unable to generate pdf. Please try again");
      setLoading(false);
      setLoadingState("");
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <SectionTitle title="Make Payment" subtitle="New Payment" />

      <Widget
        title="Kindly ensure that all the information provided are accurate and true."
        description={
          <span>Note that all fields with asterisk (*) must be completed</span>
        }
      >
        <form onSubmit={handleSubmit(SubmitHandler)}>
          <div>
            <h1 className="text-base font-semibold">Personal Information</h1>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="TAX ID"
                  required
                  ref={register}
                  name="KGTIN"
                  value={data?.taxPayerInfo?.KGTIN ?? ""}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Name"
                  ref={register}
                  required
                  name="name"
                  value={data?.taxPayerInfo?.tp_name ?? ""}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Phone Number"
                  ref={register({
                    minLength: 10,
                    maxLength: 11,
                    pattern: {
                      value: /^[0-9]*[.]?[0-9]*$/,
                      message: "Phone Number must be a number",
                    },
                  })}
                  required
                  name="phoneNumber"
                  defaultValue={data?.taxPayerInfo?.phone_number ?? ""}
                />
                {errors.phoneNumber &&
                  errors.phoneNumber.type === "minLength" && (
                    <p className="text-red-600">
                      Phone Number must be at least 10 digits
                    </p>
                  )}
                {errors.phoneNumber &&
                  errors.phoneNumber.type === "maxLength" && (
                    <p className="text-red-600">
                      Phone Number must be not be more than 11 digits
                    </p>
                  )}

                {errors.phoneNumber && (
                  <p className="text-red-600 bg-white">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Taxpayer Type"
                  required
                  ref={register}
                  value={data?.taxPayerInfo?.tp_type ?? ""}
                  name="taxPayerType"
                />
              </div>

              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Email Address"
                  required
                  ref={register({
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                  defaultValue={data?.taxPayerInfo?.email?.trim() ?? ""}
                  name="email"
                />
                {errors.email && (
                  <p className="text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Residential Address"
                  required
                  ref={register}
                  value={`${
                    data?.taxPayerInfo?.address?.substr(0, 44) ?? ""
                  }...`}
                  name="address"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-8 "></div>
          </div>
          <div className="mt-10">
            <h1 className="text-base mt-2 mb-4 font-semibold">
              Payment Information
            </h1>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <select
                  onChange={filterItem}
                  required
                  ref={register({ required: true })}
                  name="mda"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select MDA</option>
                  {arr.map((md, i) => (
                    <option value={md} key={i}>
                      {md}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full lg:w-1/4">
                <select
                  required
                  ref={register({ required: true })}
                  name="revenueItem"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select Item</option>
                  {item.map((item, i) => (
                    <option value={item.rev_code} key={item.serial}>
                      {item.item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full lg:w-1/4">
                <select
                  required
                  ref={register({ required: true })}
                  name="taxOffice"
                  className="w-full focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select Tax Station</option>
                  <option selected value={data?.taxPayerInfo?.tax_office}>
                    {data?.taxPayerInfo?.tax_office}
                  </option>
                  {taxStation
                    .filter(
                      (station) =>
                        data?.taxPayerInfo.tax_office !== station.value
                    )
                    .map((office) => (
                      <option value={office.value} key={office.name}>
                        {office.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4 mt-2 mb-4">
            <div className="w-full lg:w-1/4">
              <NewFormInput
                label="Amount"
                required
                ref={register({
                  minLength: 4,
                  pattern: {
                    value: /^[0-9]*[.]?[0-9]*$/,
                    message: "Amount must be a number",
                  },
                })}
                name="amount"
              />
              {errors.amount && errors.amount.type === "minLength" && (
                <p className="text-red-600">
                  Amount cannot be less than {formatNumber(1000)}
                </p>
              )}
              {errors.amount && (
                <p className="text-red-600 bg-white">{errors.amount.message}</p>
              )}
            </div>

            <div className="w-full lg:w-1/4 lg:mt-6">
              <select
                required
                ref={register({ required: true })}
                name="channel"
                className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
              >
                <option value="">Select Payment Channel</option>
                {channel.map((channel) => (
                  <option value={channel.key} key={channel.key}>
                    {channel.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <SubmitButton text="Make Payment">Make Payment</SubmitButton>
        </form>
      </Widget>

      {open && (
        <>
          <div className="modal-backdrop fade-in"></div>
          <div className="modal show">
            <div className="relative w-auto lg:my-4 mx-auto lg:max-w-lg max-w-sm">
              <div className="bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none">
                <div className="relative p-4 flex-auto">
                  <div className="flex items-start justify-start p-2 space-x-4">
                    <div className="flex-shrink-0 w-12">
                      <span className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                        <FiSend
                          size={18}
                          className="stroke-current text-green-500"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-lg mb-2 font-bold">
                        <span>Payment Confirmation</span>
                      </div>
                    </div>
                  </div>
                  {pdfMessage && (
                    <div className="px-4">
                      <p className="border-l-2  border-green-500 p-1 text-green-500">
                        {pdfMessage}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  {modalData?.length > 0 &&
                    modalData.map((dat) => {
                      return (
                        <div key={uuidv4()}>
                          <div className="p-2 text-sm">
                            <table className="table-fixed w-full">
                              <tbody className="divide-y">
                                <tr>
                                  <td>KGTIN</td>
                                  <td>{dat.KGTIN}</td>
                                </tr>
                                <tr className="">
                                  <td>Phone Number</td>
                                  <td>{dat.phoneNumber}</td>
                                </tr>
                                <tr>
                                  <td>email</td>
                                  <td>{dat.email}</td>
                                </tr>
                                <tr>
                                  <td>Agency</td>
                                  <td>{dat.mda}</td>
                                </tr>
                                <tr>
                                  <td>Revenue Item</td>
                                  <td>{dat.itemName}</td>
                                </tr>
                                <tr>
                                  <td>Amount</td>
                                  <td>{formatNumber(dat.amount)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="flex items-center justify-end p-4  dark:border-gray-700 border-solid rounded-b space-x-2">
                  <SubmitButton
                    onClick={() => submit(modalData[0])}
                    disabled={loading}
                  >
                    {loadingState !== "" ? loadingState : "Confirm Payment"}
                    <Loader
                      visible={loading}
                      type="TailSpin"
                      color="white"
                      height={19}
                      width={19}
                      timeout={0}
                      className="ml-2"
                    />
                  </SubmitButton>

                  <button
                    className="disabled:cursor-not-allowed btn btn-default btn-rounded bg-white hover:bg-gray-100 text-gray-900"
                    type="button"
                    onClick={hide}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default NewPaymentForm;
