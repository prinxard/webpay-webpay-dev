import { saveAs } from "file-saver";
import axios from "axios";
import url from "../config/url";
import { useRouter } from "next/router";

const FetchBankPrint = async (assessmentId, taxId) => {
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
  } catch (err) {
    alert("Unable to generate pdf. Please try again");
  }
};

const ProcessPayments = async (paymentChannel, assessmentId, taxId) => {
  //   const router = useRouter();
  if (paymentChannel === "Bank Branch") {
    await FetchBankPrint(assessmentId, taxId);
  } else {
    // if (paymentChannel === "Remita") {
    //   router.push(
    //     `${url.PAY_URL}remita/initialize.php?assessmentId=${assessmentId}&taxId=${taxId}`
    //   );
    // } else if (paymentChannel === "eTransact") {
    //   router.push(
    //     `${url.PAY_URL}etransact/initialize.php?assessmentId=${assessmentId}&taxId=${taxId}`
    //   );
    // } else if (paymentChannel === "WebPay") {
    //   router.push(
    //     `${url.PAY_URL}interswitch/initialize.php?assessmentId=${assessmentId}&taxId=${taxId}`
    //   );
    // }
  }
  return <></>;
};

export default ProcessPayments;
