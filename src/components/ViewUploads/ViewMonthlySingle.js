import SectionTitle from "../section-title";
import Widget from "../widget";
import { NewFormInput } from "../FormInput/formInputs";
import { useRouter } from "next/router";
import { ViewMonthlyTableSingle } from "../tables/viewMonthlyTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { CustomPagination } from "../pagination/customPagination";
import url from "../../config/url";
import setAuthToken from "../../functions/setAuthToken";
import { formatNumber } from "../../functions/numbers";
import { DeleteButton } from "../CustomButton/CustomButton";
import Link from "next/link";
import Loader from "react-loader-spinner";

const ViewMonthlySingle = () => {
  const [post, setPost] = useState(() => []);
  const [total, setTotal] = useState(() => []);
  const [isFetching, setIsFetching] = useState(() => true);
  const [currentPage, setCurrentPage] = useState(() => 1);
  const [postPerPage, setPostPerPage] = useState(20);
  const [query, setQuery] = useState(() => "");
  const router = useRouter();

  useEffect(() => {
    if (router && router.query) {
      let period = router.query.period;
      setAuthToken();
      const fetchPost = async () => {
        try {
          let res = await axios.get(
            `${url.BASE_URL}monthly/view-returns/${period}`
          );
          res = res.data.body;

          let sum = {};
          let records = [];
          let salarySum = [];
          let chargeableSum = [];
          let totalReliefSum = [];
          let taxSum = [];
          for (let i = 0; i < res.length; i++) {
            let rec = res[i];
            if (rec.ref === null) {
              rec.status = "Unpaid";
            } else {
              rec.status = "Paid";
            }
            rec.salary = parseInt(rec.salary);
            rec.chargeable = parseInt(rec.chargeable) / 12;
            rec.totalRelief = parseInt(rec.totalRelief);
            rec.tax = parseInt(rec.tax);
            salarySum.push(rec.salary);
            chargeableSum.push(rec.chargeable);
            totalReliefSum.push(rec.totalRelief);
            taxSum.push(rec.tax);
            rec.tax = formatNumber(rec.tax);
            rec.totalRelief = formatNumber(rec.totalRelief);
            rec.chargeable = formatNumber(rec.chargeable);
            rec.salary = formatNumber(rec.salary);
            rec.name = `${rec.surname} ${rec.middleName} ${rec.firstName}`;
            records.push(rec);
          }

          const totalSalary = salarySum.reduce(
            (preVal, curVal) => preVal + curVal,
            0
          );
          const totalChargeable = chargeableSum.reduce(
            (preVal, curVal) => preVal + curVal,
            0
          );
          const totalRelief = totalReliefSum.reduce(
            (preVal, curVal) => preVal + curVal,
            0
          );
          const totalTax = taxSum.reduce(
            (preVal, curVal) => preVal + curVal,
            0
          );
          sum.totalSalary = totalSalary;
          sum.totalChargeable = totalChargeable;
          sum.totalRelief = totalRelief;
          sum.totalTax = totalTax;
          setIsFetching(false);
          setPost(() => records);
          setTotal(() => sum);
        } catch (e) {
          setIsFetching(false);
        }
      };
      fetchPost();
    }
  }, [router]);

  // Get current post
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = post.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const next = (currentPage) => setCurrentPage(() => currentPage + 1);
  const previous = (currentPage) => setCurrentPage(() => currentPage - 1);

  const searchHandler = (e) => {
    setQuery(() => e.target.value.toLowerCase());
  };

  let res = [];
  const search = (rows) => {
    let data = [];
    data = rows.filter((rows) => rows.name.toLowerCase().indexOf(query) > -1);
    res.push(data);
    return data;
  };

  const searchedPost = search(post).slice(indexOfFirstPost, indexOfLastPost);
  const deleteHandler = async (assessmentId) => {
    try {
      setAuthToken();
      let res = await axios.delete(
        `${url.BASE_URL}payment/delete-pending-invoice/${assessmentId}`
      );

      console.log(res.data);
      alert(res.data.message);
      router.push("/view/monthly");
    } catch (e) {
      if (e.response) {
        alert(e.response.message);
      }
    }
  };

  const deletePrompt = (assessmentId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteHandler(assessmentId);
    }
  };

  return (
    <>
      <SectionTitle title="View Uploads" subtitle="Monthly PAYE Returns" />
      {isFetching && (
        <div className="flex justify-center item mb-2">
          <Loader
            visible={isFetching}
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
      <Widget>
        <div className="flex lg:flex-wrap w-full lg:space-x-4 justify-between items-center">
          <div className="w-32">
            <NewFormInput
              label="Search by name"
              required
              onChange={searchHandler}
            />
          </div>
          {post[0]?.status === "Unpaid" ? (
            <>
              <div className="lg:flex md:flex justify-between">
                <div className="w-32 mb-2">
                  <Link href={`/pending-payment/${post[0]?.assessmentId}`}>
                    <a className="inline-flex disabled:opacity-50 bg-green-500 py-2 px-6 rounded-md  text-white border hover:text-green-500 hover:bg-white hover:border-green-500">
                      Pay Now
                    </a>
                  </Link>
                </div>
                <div className="w-32">
                  <DeleteButton
                    onClick={() => deletePrompt(post[0]?.assessmentId)}
                  >
                    Delete
                  </DeleteButton>
                </div>
              </div>
            </>
          ) : post[0]?.status === "Paid" ? (
            <>
              <div className="lg:flex md:flex justify-between">
                <div className="w-32 mb-2">
                  <Link href={`/receipt/${post[0]?.assessmentId}`}>
                    <a className="inline-flex disabled:opacity-50 bg-green-500 py-2 px-6 rounded-md  text-white border hover:text-green-500 hover:bg-white hover:border-green-500">
                      Get Receipt
                    </a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="mt-4">
          {query !== "" ? (
            <>
              <ViewMonthlyTableSingle remittance={searchedPost} total={total} />
              <CustomPagination
                paginate={paginate}
                totalPosts={res[0].length}
                postPerPage={postPerPage}
                currentPage={currentPage}
                next={next}
                previous={previous}
              />
            </>
          ) : (
            <>
              <ViewMonthlyTableSingle remittance={currentPosts} total={total} />
              <CustomPagination
                paginate={paginate}
                totalPosts={post.length}
                postPerPage={postPerPage}
                currentPage={currentPage}
                next={next}
                previous={previous}
              />
            </>
          )}
        </div>
      </Widget>
    </>
  );
};

export default ViewMonthlySingle;
