import SectionTitle from "../../components/section-title";
import Widget from "../../components/widget";
import { formatNumber } from "../../functions/numbers";
import dateformat from "dateformat";
import { useState } from "react";
import url from "../../config/url";
import axios from "axios";
import { KgirsLogo } from "../../components/Images/Images";
import { saveAs } from "file-saver";
import Loader from "react-loader-spinner";
import { useForm } from "react-hook-form";

const Index = () => {
  const [submitting, setSubmitting] = useState(() => false);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  //fetch receipt
  const fetchReceipt = async ({ ref, taxId }) => {
    setSubmitting(() => true);
    try {
      const res = await axios.post(
        `${url.BASE_URL}web/receipt-pdf`,
        { ref, taxId },
        {
          responseType: "blob",
        }
      );
      console.log(res.data);
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, `${ref}__receipt.pdf`);
      setSubmitting(() => false);
    } catch (err) {
      setSubmitting(() => false);
      alert("Unable to download receipt. Please try again");
    }
  };

  const SubmitHandler = async (payload) => {
    setIsLoading(true);
    try {
      let result = await axios.post(`${url.BASE_URL}web/receipt`, payload);
      if (result.data.status === 200) {
        setData(result.data.body);
      }
      setIsLoading(false);
    } catch (error) {
      setData({});
      setIsLoading(false);
      if (error.response && error.response.data.status === 401) {
        alert("No records found");
      } else if (error && error.request) {
        alert("Unable to perform request. Please try again");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(SubmitHandler)} autoComplete="off">
        <div className="flex justify-center p-4">
          <div className="flex w-96">
            <input
              disabled={isLoading}
              name="ref"
              ref={register()}
              className="w-full rounded-l border-t-2 border-l-2 border-b-2  py-3 px-4 outline-none focus:bg-gray-100"
              placeholder="Enter payment reference"
              required
            />
            <button
              className="bg-green-500  disabled:opacity-50 hover:bg-green-600 text-white rounded-r px-4 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
              <Loader
                visible={isLoading}
                type="BallTriangle"
                color="white"
                height={19}
                width={19}
                timeout={0}
                className="ml-2"
              />
            </button>
          </div>
        </div>
      </form>

      {Object.keys(data).length > 1 && (
        <div className="px-8">
          <SectionTitle subtitle="Receipt" />
          <Widget>
            <div className="py-10 w-full">
              <div className="flex flex-row items-center justify-between mb-4">
                <KgirsLogo />
                <span className="text-center text-lg text-green-500">
                  Status: Paid
                </span>
              </div>
              <div className="lg:flex justify-between w-full">
                <div className="w-full">
                  <div className="lg:w-4/5 w-full px-2">
                    <h6 className="font-bold mb-2 text-base text-gray-500">
                      Personal details
                    </h6>
                    <div className="space-y-2 uppercase w-auto">
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm">Taxpayer name</h1>
                        <span className="text-black font-semibold">
                          {data?.taxPayerName}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">taxpayer type</h1>
                        <span className="text-black font-semibold">
                          {data?.taxPayerType}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm"> taxpayer id</h1>
                        <span className="text-black font-semibold">
                          {data?.t_payer}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">tax office</h1>
                        <span className="text-black font-semibold">
                          {data?.station}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="lg:w-4/5 w-full px-2">
                    <h6 className="font-bold mb-2 text-base text-gray-500">
                      Item details
                    </h6>
                    <div className="space-y-2 uppercase">
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">Revenue item</h1>
                        <span className="text-black font-semibold">
                          {data?.itemName}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm"> Agency</h1>
                        <span className="text-black font-semibold">
                          {data?.mdaName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="uppercase lg:w-4/5 w-full px-2">
                    <h6 className="font-bold mb-2 text-base text-gray-500">
                      Payment details
                    </h6>
                    <div className="shadow-lg w-full">
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">payment channel</h1>
                        <span className="text-black font-semibold">
                          {data?.pmt_meth}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">payment reference</h1>
                        <span className="text-black font-semibold">
                          {data?.ref}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">creation date</h1>
                        <span className="text-black font-semibold">
                          {dateformat(data?.tran_date, "ddd, dS mmm, yyyy")}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">tax office</h1>
                        <span className="text-black font-semibold">
                          {data?.station}
                        </span>
                      </div>
                      <div className="bg-gray-100  w-full p-2">
                        <h1 className="text-sm ">amount</h1>
                        <span className="text-green-600 text-xl font-semibold">
                          &#8358;{formatNumber(data?.amount)}
                        </span>
                      </div>

                      <button
                        className="text-black font-semibold px-25 bg-white  w-full border-green-500 p-2 border text-center"
                        onClick={() =>
                          fetchReceipt({ ref: data.ref, taxId: data.t_payer })
                        }
                        disabled={submitting}
                      >
                        <div className="flex justify-center">
                          <p>{`${
                            submitting
                              ? "Downloading Receipt..."
                              : "Download Receipt"
                          }`}</p>
                          <Loader
                            visible={submitting}
                            type="TailSpin"
                            color="#00FA9A"
                            height={19}
                            width={19}
                            timeout={0}
                            className="ml-2"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Widget>
        </div>
      )}
    </>
  );
};

export default Index;
