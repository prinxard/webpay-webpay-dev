import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SectionTitle from "../section-title";
import Widget from "../widget";
import { NewFormInput } from "../FormInput/formInputs";
import axios from "axios";
import { SubmitButton } from "../CustomButton/CustomButton";
import url from "../../config/url";
import { useRouter } from "next/router";
import { FiSend } from "react-icons/fi";
import { formatNumber } from "../../functions/numbers";
import { ProcessorSpinner } from "../spiner";
import { saveAs } from "file-saver";
import { taxStation } from "../../json/taxOffice";
import UseFetcher from "../fetcher/useFetcher";
import Link from "next/dist/client/link";


const NewPaymentForm = ({ res }) => {
  const { data } = UseFetcher(`${url.BASE_URL}web/get-mdas-items`, res);
  const [revItems, setRevitems] = useState([]);
  const [userInfo, setUserInfo] = useState(() => { });
  const [payInfo, setPayInfo] = useState(() => { });
  const [globalRef, setGlobalRef] = useState(() => "");
  const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const [openContinuePay, setOpenContinuePay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [pdfMessage, setPdfMessage] = useState(null);
  const [previewData, setPreviewData] = useState({});
  const [modalUrl, setModalUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { register: registerForm2,
    handleSubmit: handleSubmitForm2,
    formState: { errors: errorsForm2 },
    mode: modeForm2,
    reValidateMode: reValidateModeForm2
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit"
  });
  const [channel, setChannel] = useState([
    { key: "Credo", value: "Credo" },
    { key: "Monnify", value: "Monnify" },
    { key: "Remita", value: "Remita" },
    { key: "Monnify offline", value: "Offline" },
  ]);


  const Modal = ({ isOpen, onClose, url }) => {
    const handleClose = () => {
      onClose();
    };

    return (
      <>
        {isOpen && (

          <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <iframe src={url} className="w-full h-full lg:h-100vw border-0"></iframe>
          </div>

        )}
      </>
    );
  };

  const handleModalOpen = (url) => {
    setIsModalOpen(true);
    setModalUrl(url);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalUrl("");
  };

  const router = useRouter();
  useEffect(() => {
    let payReference = Math.floor((Math.random() * 1000000000) + 1);
    setGlobalRef(String(payReference))
  }, []);


  const filter = (val) => {
    setRevitems(data.res.filter((re) => val === re.rev_code.split("/")[0]));
    let da = val;
    const filteredChannel = channel.filter(
      (channel) => channel.key !== "Remita"
    );
    if (da !== "22000800100") {
      setChannel(filteredChannel);
    } else {
      setChannel(() => [
        ...filteredChannel,
        { key: "Remita", value: "Remita" },
      ]);
    }
  };


  const taxIdFetcher = async (e) => {
    let id = e.target.value;
    if (id.length === 10 && !errors.hasOwnProperty("KGTIN")) {
      setIsFetchingUserInfo(true);
      try {
        let result = await axios.post(`${url.BASE_URL}web/user-info`, {
          kgtin: id,
        });
        console.log("result", result);
        setUserInfo(() => result.data.body);
        setIsFetchingUserInfo(false);
      } catch (e) {
        setIsFetchingUserInfo(false);
        setUserInfo({});
        if (e && e?.response?.data?.message) {
          setTimeout(() => {
            alert("User not Found");
          }, 100);
        } else {
          setTimeout(() => {
            alert("There was an error...Please try again");
          }, 100);
        }
      }
    }
  };

  const returningPaymentInfo = async (e) => {
    let id = e.target.value;
    if (id.length === 12 && !errors.hasOwnProperty("assessment_id")) {
      setIsFetchingUserInfo(true);
      try {
        let result = await axios.get(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/findpartpayment.php?assessment=${id}`);
        setPayInfo(() => result.data.body);
        setIsFetchingUserInfo(false);
      } catch (e) {
        setIsFetchingUserInfo(false);
        setPayInfo({});
        if (e && e?.response?.data?.message) {
          setTimeout(() => {
            alert("User not Found");
          }, 100);
        } else {
          setTimeout(() => {
            alert("There was an error...Please try again");
          }, 100);
        }
      }
    }
  };

  const validateAmount = (value) => {
    if (value < 50) {
      errors.lessAmount = true;
    } else {
      if (errors.hasOwnProperty("lessAmount")) {
        delete errors.lessAmount;
      }
    }
  };

  const submitHandler = (payload) => {
    payload.mdaName = data.Mdas.filter(
      (m) => m.mdaCode === payload.mda
    )[0].mdaName;
    payload.itemName = revItems.filter(
      (r) => r.rev_code === payload.revenueItem
    )[0].item;
    setPreviewData(payload);
    setOpen(true);
  };

  const submitReturning = (data) => {
    data.paygatewayclient = "quickpay";
    data.phoneNumber = "0708 811 7808"
    data.channel = data.paymentgateway;

    const queryParams = new URLSearchParams(data).toString();
    try {
      let result = axios.get(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/recordpayment.php?${queryParams}`);
      handleModalOpen(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/processpayment.php?paymentref=${globalRef}`)
    } catch (e) {
      console.log(e);
    }

  }


  const proceedHandler = async (data) => {

    let formData = {};
    formData.name = data.name;
    formData.email = data.email;
    formData.phoneNumber = data.phoneNumber;
    formData.station = data.station;
    formData.amount = data.amount;
    formData.channel = data.paymentgateway;
    formData.KGTIN = data.KGTIN;
    formData.revenueSub = data.revenueItem;
    formData.agency = data.mda;
    formData.description = data.description;
    formData.paymentRef = globalRef;
    formData.paymentgateway = data.paymentgateway;
    formData.paygatewayclient = "quickpay";

    const queryParams = new URLSearchParams(formData).toString();

    console.log("form data", formData);

    try {
      setLoading(true);
      // setDisabled(true);

      let result = await axios.get(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/recordpayment.php?${queryParams}`);
      handleModalOpen(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/processpayment.php?paymentref=${globalRef}`)

      // if (data.paymentgateway === "Bank Branch") {
      //   await fetchBankPrint(assessmentId, taxId);
      // }
      // else if (data.paymentgateway.toUpperCase() === "MONNIFY") {
      //   payWithMonnify()
      // }
      // else if (data.paymentgateway.toUpperCase() === "CREDO") {
      //   payWithCredo()
      // }

    } catch (e) {
      setLoading(false);
      // setDisabled(false);
      console.log(e);
    }
  };


  const fetchBankPrint = async (assessmentId, taxId) => {
    try {
      const res = await axios.post(
        `${url.BASE_URL}web/bank-print`,
        {
          assessmentId,
          taxId,
        },
        {
          responseType: "blob",
        }
      );
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, `${assessmentId}.pdf`);
      setPdfMessage(
        "Assessment successfully created. Tender downloaded pdf at bank to make payment."
      );
      setTimeout(() => {
        router.reload();
      }, 8000);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setDisabled(false);
      alert("Unable to generate pdf. Please try again");
    }
  };

  return (
    <>

      {isFetchingUserInfo && <ProcessorSpinner />}
      <div className="flex ">
        <SectionTitle title="Etax" subtitle="Tax Payment" />
        <section className="w-64 bg-green-600 text-white grid justify-items-center rounded">
          <button onClick={() => setOpenContinuePay(true)}>Returning Payment? <br /> Complete   it here!</button>
        </section>
      </div>

      <Widget
        title="Kindly ensure that all the information provided are accurate and true."
        description={
          <span>Note that all fields with asterisk (*) must be completed</span>
        }
      >
        <Modal isOpen={isModalOpen} onClose={handleModalClose} url={modalUrl} />

        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <h1 className="text-base font-semibold">Personal Information</h1>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="TAX ID"
                  onChange={(e) => taxIdFetcher(e)}
                  required
                  maxLength="10"
                  ref={register({
                    minLength: 10,
                    maxLength: 11,
                    pattern: {
                      value: /^[0-9]*[.]?[0-9]*$/,
                      message: "Tax Id must be a number",
                    },
                  })}
                  name="KGTIN"
                />
                {errors.KGTIN && errors.KGTIN.type === "minLength" && (
                  <p className="text-red-600">
                    Tax Id must be at least 10 digits
                  </p>
                )}
                {errors.KGTIN && errors.KGTIN.type === "maxLength" && (
                  <p className="text-red-600">
                    Tax Id must be not be more than 10 digits
                  </p>
                )}

                {errors.KGTIN && (
                  <p className="text-red-600 bg-white">
                    {errors.KGTIN.message}
                  </p>
                )}
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Name"
                  required
                  ref={register()}
                  name="name"
                  value={userInfo?.tp_name || ""}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Taxpayer Type"
                  required
                  ref={register()}
                  name="taxPayerType"
                  value={userInfo?.tp_type || ""}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Phone Number"
                  required
                  ref={register({
                    minLength: 10,
                    maxLength: 11,
                    pattern: {
                      value: /^[0-9]*[.]?[0-9]*$/,
                      message: "Phone Number must be a number",
                    },
                  })}
                  name="phoneNumber"
                  defaultValue={userInfo?.phone_number || ""}
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
                  name="email"
                  defaultValue={userInfo?.email?.trim() || ""}
                />
                {errors.email && (
                  <p className="text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Residential Address"
                  required
                  ref={register()}
                  name="address"
                  defaultValue={userInfo?.address || ""}
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
                  onChange={(e) => filter(e.target.value)}
                  required
                  ref={register()}
                  name="mda"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select MDA</option>
                  {data &&
                    data?.Mdas?.map((rev, i) => (
                      <option key={i} value={rev.mdaCode}>
                        {rev.mdaName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full lg:w-1/4">
                <select
                  required
                  ref={register()}
                  name="revenueItem"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select Item</option>
                  {revItems.length > 0 &&
                    revItems.map((revItem) => (
                      <option value={revItem.rev_code} key={revItem.serial}>
                        {revItem.item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full lg:w-1/4">
                <select
                  required
                  ref={register()}
                  name="station"
                  className="w-full focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select Tax Station</option>
                  {taxStation.map((station, i) => (
                    <option value={station.value} key={i}>
                      {station.name}
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
                ref={register({
                  pattern: {
                    value: /^[0-9]*[.]?[0-9]*$/,
                    message: "Amount must be a number",
                  },
                })}
                required
                name="amount"
                onChange={(e) => validateAmount(e.target.value)}
              />
              {errors.lessAmount && (
                <p className="text-red-600">
                  Amount cannot be less than {formatNumber(500)}
                </p>
              )}
              {errors.amount && (
                <p className="text-red-600 bg-white">{errors.amount.message}</p>
              )}
            </div>
            <div className="w-full lg:w-1/4">
              <NewFormInput
                label="Description"
                ref={register()}
                required
                name="description"
              />
            </div>

            <div className="w-full lg:w-1/4 lg:mt-6">
              <select
                required
                name="paymentgateway"
                ref={register()}
                className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
              >
                <option value="">Select Payment Channel</option>
                {channel.map((channel) => (
                  <option value={channel.value} key={channel.key}>
                    {channel.key}
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
                </div>
                <div>
                  {pdfMessage && (
                    <div className="px-4">
                      <p className="border-l-2  border-green-500 p-1 text-green-700">
                        {pdfMessage}
                      </p>
                    </div>
                  )}
                  <div className="p-4 text-sm">
                    <table className="table-fixed w-full">
                      <tbody className="divide-y">
                        <tr>
                          <td>Trans ID</td>
                          <td>{globalRef}</td>
                        </tr>
                        <tr>
                          <td>KGTIN</td>
                          <td>{previewData?.KGTIN}</td>
                        </tr>
                        <tr className="">
                          <td>Phone Number</td>
                          <td>{previewData?.phoneNumber}</td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td>{previewData?.email}</td>
                        </tr>
                        <tr>
                          <td>Tax Station</td>
                          <td>{previewData?.station}</td>
                        </tr>
                        <tr>
                          <td>Agency</td>
                          <td>{previewData?.mdaName}</td>
                        </tr>
                        <tr>
                          <td>Revenue Item</td>
                          <td>{previewData?.itemName}</td>
                        </tr>
                        <tr>
                          <td>Amount</td>
                          <td>{formatNumber(previewData?.amount)}</td>
                        </tr>
                        <tr>
                          <td>Description</td>
                          <td>{previewData?.description}</td>
                        </tr>
                        <tr>
                          <td>Payment Channel</td>
                          <td>{previewData.paymentgateway}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center  p-4  dark:border-gray-700 border-solid rounded-b space-x-2">
                  <SubmitButton
                    onClick={() => proceedHandler(previewData)}
                  // disabled={disabled}
                  >
                    {/* {`${loading ? "Generating..." : "Proceed"} `}
                    <Loader
                      visible={loading}
                      type="ThreeDots"
                      color="white"
                      height={20}
                      width={20}
                      timeout={0}
                      className="ml-2"
                    /> */}
                    Proceed
                  </SubmitButton>

                  <button
                    disabled={disabled}
                    className="disabled:cursor-not-allowed btn btn-default btn-rounded bg-white hover:bg-gray-100 text-gray-900"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {openContinuePay && (
        <>
          <div className="modal-backdrop fade-in"></div>
          <div className="modal show">
            <div className="relative w-auto lg:my-4 mx-auto lg:max-w-lg max-w-sm">
              <div className="bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none">
                <div className="relative p-4 flex-auto">
                  <div className="flex items-start justify-start p-2 space-x-4">
                    <div className="flex-shrink-0 w-12">
                      <span className="h-10 w-10 bg-yellow-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                        <FiSend
                          size={18}
                          className="stroke-current text-yellow-500"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-lg mb-2 font-bold">
                        <span>Returning Payment</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <form className="p-4 text-sm" onSubmit={handleSubmitForm2(submitReturning)}>
                    {Number(payInfo?.balance) === 0 ?
                      <p className="text-green-600 bg-white text-center">
                        Payment Completed!
                      </p>
                      :
                      ""
                    }
                    <div className="w-full">
                      <NewFormInput
                        label="Assessment ID"
                        onChange={(e) => returningPaymentInfo(e)}
                        required
                        maxLength="13"
                        ref={registerForm2({
                          minLength: 12,
                          maxLength: 13,
                        })}
                        name="assessment_id"
                      />
                      {errorsForm2.assessment_id && errorsForm2.assessment_id.type === "minLength" && (
                        <p className="text-red-600">
                          must be at least 10 characters
                        </p>
                      )}
                      {errorsForm2.assessment_id && errorsForm2.assessment_id.type === "maxLength" && (
                        <p className="text-red-600">
                          must be not be more than 13 characters
                        </p>
                      )}
                    </div>
                    {payInfo?.balance > 0 ?
                      <div>
                        <div className="">
                          <NewFormInput
                            label="Name"
                            required
                            ref={registerForm2()}
                            name="name"
                            value={payInfo?.details || ""}
                          />
                        </div>
                        <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
                          <div className="">
                            <NewFormInput
                              label="description"
                              required
                              ref={registerForm2()}
                              name="description"
                              value={payInfo?.description || ""}
                            />
                          </div>
                          <div className="">
                            <NewFormInput
                              label="KGTIN"
                              required
                              ref={registerForm2()}
                              name="KGTIN"
                              value={payInfo?.t_payer || ""}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">

                          <div className="">
                            <NewFormInput
                              label="Payment Ref"
                              required
                              ref={registerForm2()}
                              name="paymentRef"
                              value={globalRef}
                            />
                          </div>

                          <div className="">
                            <NewFormInput
                              label="Total Amount"
                              value={payInfo?.actualamount || ""}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">

                          <div className="">
                            <NewFormInput
                              label="Balance"
                              required
                              ref={registerForm2()}
                              name="amount"
                              value={payInfo?.balance || ""}
                            />
                          </div>
                          <div className="">
                            <NewFormInput
                              label="email"
                              required
                              ref={registerForm2()}
                              name="email"
                              defaultValue={payInfo?.acc_no || ""}
                            />
                          </div>
                        </div>
                        <div className="">
                          <select
                            required
                            name="paymentgateway"
                            ref={registerForm2()}
                            className="focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                          >
                            <option value="">Channel</option>
                            {channel.map((channel) => (
                              <option value={channel.key} key={channel.key}>
                                {channel.value}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex hidden flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
                          <div className="">
                            <NewFormInput
                              label="station"
                              required
                              ref={registerForm2()}
                              name="station"
                              value={payInfo?.station || ""}
                            />
                          </div>
                          <div className="">
                            <NewFormInput
                              label="revenue item"
                              required
                              ref={registerForm2()}
                              name="revenueSub"
                              value={payInfo?.rev_sub || ""}
                            />
                          </div>
                        </div>
                        <div className="flex hidden flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">

                          <div className="">
                            <NewFormInput
                              label="MDA"
                              required
                              ref={registerForm2()}
                              name="agency"
                              value={payInfo?.agency || ""}
                            />
                          </div>

                        </div>
                      </div>
                      : ""
                    }

                    <div className="flex items-center  p-4  dark:border-gray-700 border-solid rounded-b space-x-2">
                      {payInfo?.balance === 0 ?
                        <Link href={`/receipt-download/${payInfo?.assessment_id}`}>
                          <SubmitButton>
                            Get receipt
                          </SubmitButton>
                        </Link>
                        :
                        <SubmitButton>
                          Continue Payment
                        </SubmitButton>
                      }

                      <button
                        disabled={disabled}
                        className="disabled:cursor-not-allowed btn btn-default btn-rounded bg-white hover:bg-gray-100 text-gray-900"
                        type="button"
                        onClick={() => setOpenContinuePay(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
      {/* <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModalOpen}
      >
        Open Modal
      </button> */}
    </>
  );
};
export default NewPaymentForm;
