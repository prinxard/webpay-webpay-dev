import React, { useState, useEffect } from "react";
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
import { ProcessorSpinner } from "../spiner";
import { saveAs } from "file-saver";
import { taxStation } from "../../json/taxOffice";
import UseFetcher from "../fetcher/useFetcher";



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
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { register: registerForm2, handleSubmit: handleSubmitForm2, formState: { errors: errorsForm2 }, mode: modeForm2, reValidateMode: reValidateModeForm2 } = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit"
  });
  const [channel, setChannel] = useState([
    // { key: "eTransact", value: "eTransact" },
    // { key: "WebPay", value: "Interswitch" },
    // { key: "Remita", value: "Remita" },
    // { key: "Bank Branch", value: "Bank Branch" },
    { key: "Monnify", value: "Monnify" },
  ]);



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
    if (id.length === 12 && !errors.hasOwnProperty("payref")) {
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
    function payReturningWithMonnify() {
      MonnifySDK.initialize({
        amount: data.amount,
        currency: "NGN",
        reference: globalRef,
        customerName: data.name,
        customerEmail: data.email,
        apiKey: "MK_TEST_3NP2GGZBRN",
        contractCode: "5214854348",
        paymentDescription: data.description,
        isTestMode: true,
        metadata: {
          "name": "Damilare",
          "age": 45
        },
        paymentMethods: ["CARD",
          "USSD",
          "PHONE_NUMBER",
          "DIRECT_DEBIT",
          "CASH",
          "ACCOUNT_TRANSFER",],
        onComplete: function (response) {
          //Implement what happens when transaction is completed.
          // alert("Payment Successful!")
          console.log(response);
          window.location = `https://quickpay.irs.kg.gov.ng/receipt-download/${response.paymentReference}`;
          // var res_paid = response['amountPaid'];
          // var res_status = response['paymentStatus'];
          // var res_ref = response['transactionReference'];
          // window.location = 'TaxPayDetails?verify=' + payReference;
        },
        onClose: function (data) {
          // window.location=`${url.PAY_URL}monnify/failure.php?verify=${payReference}`;

          //Implement what should happen when the modal is closed here
          //	console.log(data);
          // alert('Payment was not processed');
        }
      });
    }
    const queryParams = new URLSearchParams(data).toString();
    try {
      let result = axios.get(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/recordpayment.php?${queryParams}`);
      console.log("result", result);
      payReturningWithMonnify()
    } catch (e) {

      console.log(e);
    }

  }

  const proceedHandler = async (data) => {


    let formData = {};
    formData.name = data.name;
    formData.email = data.email;
    formData.phoneNumber = data.phoneNumber;
    formData.channel = data.channel;
    formData.station = data.station;
    formData.amount = data.amount;
    formData.KGTIN = data.KGTIN;
    formData.revenueSub = data.revenueItem;
    formData.agency = data.mda;
    formData.description = data.description;
    formData.paymentRef = globalRef;
    console.log("formData", formData);
    // Add field assessment_id for returning

    const queryParams = new URLSearchParams(formData).toString();
    console.log("queryParams", queryParams);

    function payWithMonnify() {
      MonnifySDK.initialize({
        amount: data.amount,
        currency: "NGN",
        reference: globalRef,
        customerName: data.name,
        customerEmail: data.email,
        apiKey: "MK_TEST_3NP2GGZBRN",
        contractCode: "5214854348",
        paymentDescription: data.description,
        isTestMode: true,
        metadata: {
          "name": "Damilare",
          "age": 45
        },
        paymentMethods: ["CARD",
          "USSD",
          "PHONE_NUMBER",
          "DIRECT_DEBIT",
          "CASH",
          "ACCOUNT_TRANSFER",],
        onComplete: function (response) {
          //Implement what happens when transaction is completed.
          // alert("Payment Successful!")
          console.log(response);
          window.location = `https://quickpay.irs.kg.gov.ng/receipt-download/${response.paymentReference}`;
          // var res_paid = response['amountPaid'];
          // var res_status = response['paymentStatus'];
          // var res_ref = response['transactionReference'];
          // window.location = 'TaxPayDetails?verify=' + payReference;
        },
        onClose: function (data) {
          // window.location=`${url.PAY_URL}monnify/failure.php?verify=${payReference}`;

          //Implement what should happen when the modal is closed here
          //	console.log(data);
          // alert('Payment was not processed');
        }
      });
    }

    try {
      // // let result = (`https://irs.kg.gov.ng/etaxwebpay/api/recordpayment.php?${queryParams}`);
      // window.location.href = result
      setLoading(true);
      setDisabled(true);
      // let result = await axios.post(`${url.BASE_URL}web/new-payment`, formData);

      let result = axios.get(`https://irs.kg.gov.ng/etaxwebpay/v3/api_v3/recordpayment.php?${queryParams}`);
      // if ((data.channel).toUpperCase() === "MONNIFY") {
      //   console.log("True");
      //   try {
      //     payWithMonnify()

      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      console.log("result", result);
      // alert(payReference)
      // if (result.data.status === 200) {
      // const { assessmentId, taxId, channel } = result.data.body;

      if (data.channel === "Bank Branch") {
        await fetchBankPrint(assessmentId, taxId);
      } else {
        payWithMonnify()
      }
      // else if (channel.toUpperCase() === "REMITA") {
      //   router.push(
      //     `${url.PAY_URL}remita/initialize.php?assessmentId=${assessmentId}&taxId=${taxId}`
      //   );
      // } else if (channel.toUpperCase() === "ETRANSACT") {
      //   router.push(
      //     `${url.PAY_URL}etransact/initialize.php?assessmentId=${assessmentId}&taxId=${taxId}`
      //   );
      // } else if (channel.toUpperCase() === "WEBPAY") {
      //   router.push(
      //     `${url.PAY_URL}interswitch/initialize.php?assessmentId=${assessmentId}&taxId=${taxId}`
      //   );
      // }
      // }

    } catch (e) {
      setLoading(false);
      setDisabled(false);
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
                name="channel"
                ref={register()}
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
                          <td>{previewData.channel}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center  p-4  dark:border-gray-700 border-solid rounded-b space-x-2">
                  <SubmitButton
                    onClick={() => proceedHandler(previewData)}
                    disabled={disabled}
                  >
                    {`${loading ? "Generating..." : "Proceed"} `}
                    <Loader
                      visible={loading}
                      type="ThreeDots"
                      color="white"
                      height={20}
                      width={20}
                      timeout={0}
                      className="ml-2"
                    />
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
                    <div className="w-full">
                      <NewFormInput
                        label="Payment ref or Assessment ID"
                        onChange={(e) => returningPaymentInfo(e)}
                        required
                        maxLength="13"
                        ref={registerForm2({
                          minLength: 12,
                          maxLength: 13,
                          // pattern: {
                          //   value: /^[0-9]*[.]?[0-9]*$/,
                          //   message: "must be a number",
                          // },
                        })}
                        name="assessId"
                      />
                      {errorsForm2.assessId && errorsForm2.assessId.type === "minLength" && (
                        <p className="text-red-600">
                          must be at least 10 characters
                        </p>
                      )}
                      {errorsForm2.assessId && errorsForm2.assessId.type === "maxLength" && (
                        <p className="text-red-600">
                          must be not be more than 13 characters
                        </p>
                      )}

                      {/* {errors.assessId && (
                        <p className="text-red-600 bg-white">
                          {errors.assessId.message}
                        </p>
                      )} */}
                    </div>

                    <div className="">
                      <NewFormInput
                        label="Name"
                        required
                        ref={registerForm2()}
                        name="name"
                        value={payInfo?.details || ""}
                      />
                    </div>
                    <div className="">
                      <NewFormInput
                        label="description"
                        required
                        ref={registerForm2()}
                        name="description"
                        value={payInfo?.description || ""}
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
                      {/* <div className="">
                        <NewFormInput
                          label="Assessment ID"
                          required
                          ref={registerForm2()}
                          name="assessment_id"
                          value={payInfo?.assessment_id || ""}
                        />
                      </div> */}
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
                          value={payInfo?.acc_no}
                        />
                      </div>
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

                    <div className="flex items-center  p-4  dark:border-gray-700 border-solid rounded-b space-x-2">
                      <SubmitButton
                      // onClick={() => proceedHandler()}
                      // disabled={disabled}
                      >
                        Continue Payment
                      </SubmitButton>

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
    </>
  );
};
export default NewPaymentForm;
