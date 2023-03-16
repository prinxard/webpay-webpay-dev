import SectionTitle from "../../components/section-title";
import Widget from "../../components/widget";
import { formatNumber } from "../../functions/numbers";
import dateformat from "dateformat";
import { useState } from "react";
import { useRouter } from "next/router";
import url from "../../config/url";
import axios from "axios";
import { KgirsLogo } from "../../components/Images/Images";
import { saveAs } from "file-saver";
import UseFetcher from "../../components/fetcher/useFetcher";
import Loader from "react-loader-spinner";

const Index = ({ res }) => {
  const [submitting, setSubmitting] = useState(() => false);
  const [refId, setRefId] = useState(() => "")
  const router = useRouter();
  useEffect(() => {
    setRefId(router.query.ref);
  }, [router.query.ref]);
  const { data, isLoading, error } = UseFetcher(
    // `${url.BASE_URL}web/receipt/${ref}`,
    `https://irs.kg.gov.ng/etaxwebpay/api/getpayment.php?paymentref=${refId}`,
    res
  );
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
      console.log("res.data", res.data);
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, `${ref}__receipt.pdf`);
      setSubmitting(() => false);
    } catch (err) {
      setSubmitting(() => false);
      alert("Unable to download receipt. Please try again");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="flex justify-center item">
          <Loader
            visible={true}
            type="BallTriangle"
            color="#00FA9A"
            height={19}
            width={19}
            timeout={0}
            className="ml-2"
          />
          <p>Fetching data...</p>
        </div>
      )}
      {Object.keys(data).length > 1 ? (
        <div className="lg:px-8 md:px-4 px-2">
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
                          {dateformat(data?.tran_date, "ddd, mmm dS, yyyy")}
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
                        // onClick={() =>
                        //   fetchReceipt({ ref: data.ref, taxId: data.t_payer })
                        // }
                        onClick={() => router.push(`/receipt-download/${refId}`)}
                      // disabled={submitting}
                      >
                        <div className="flex justify-center">
                          <p>
                            {/* {`${submitting
                                ? "Downloading Receipt..."
                                : "Download Receipt"
                              }`} */}
                            Download Receipt
                          </p>
                          {/* <Loader
                            visible={submitting}
                            type="TailSpin"
                            color="#00FA9A"
                            height={19}
                            width={19}
                            timeout={0}
                            className="ml-2"
                          /> */}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Widget>
        </div>
      ) : (
        <div className="flex justify-center items-center p-2">
          <p className=" text-red-600 font-semibold px-4">No Records found!</p>
        </div>
      )}
    </>
  );
};

export default Index;
export async function getServerSideProps(context) {
  const query = context?.query?.ref || "";
  let data;
  try {
    const res = await fetch(`${url.BASE_URL}web/receipt/${query}`);
    data = await res.json();
    data = data.body;
  } catch (error) {
    data = {};
  }

  return {
    props: {
      res: data,
    }, // will be passed to the page component as props
  };
}
