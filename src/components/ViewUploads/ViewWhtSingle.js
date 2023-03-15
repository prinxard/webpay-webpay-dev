import SectionTitle from '../section-title';
import Widget from '../widget';
import { NewFormInput } from '../FormInput/formInputs';
import { useRouter } from 'next/router';
import { ViewWhtSingleTable } from '../tables/viewWht';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CustomPagination } from '../pagination/customPagination';
import url from '../../config/url';
import setAuthToken from '../../functions/setAuthToken';
import { formatNumber } from '../../functions/numbers';
import dateformat from 'dateformat';
import Loader from 'react-loader-spinner';
import { DeleteButton } from '../CustomButton/CustomButton';
import Link from 'next/link';

const ViewWhtSingle = () => {
  const [post, setPost] = useState(() => []);
  const [total, setTotal] = useState(() => null);
  const [isFetching, setIsFetching] = useState(() => true);
  const [currentPage, setCurrentPage] = useState(() => 1);
  const [postPerPage, setPostPerPage] = useState(() => 10);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState(() => '');
  const router = useRouter();

  useEffect(() => {
    if (router && router.query) {
      let period = router.query.period;
      setAuthToken();
      const fetchPost = async () => {
        try {
          let res = await axios.get(
            `${url.BASE_URL}withholding/view-schedule/${period}`
          );
          res = res.data.body;
          console.log(res);
          let records = [];
          let total = [];
          for (let i = 0; i < res.length; i++) {
            let rec = res[i];
            if (rec.ref === null) {
              rec.status = 'Unpaid';
            } else {
              rec.status = 'Paid';
            }
            rec.withholdingAmount = parseInt(rec.withholdingAmount);
            total.push(rec.withholdingAmount);
            rec.payPeriod = dateformat(rec.payPeriod, 'mmm yyyy');
            rec.contractDate = dateformat(rec.contractDate, 'ddd mmm, yyyy');
            rec.contractAmount = formatNumber(rec.contractAmount);
            rec.withholdingAmount = formatNumber(rec.withholdingAmount);
            rec.rate = `%${rec.rate}`;
            records.push(rec);
          }
          setIsFetching(false);
          total = total.reduce((preVal, curVal) => preVal + curVal);
          setPost(() => records);
          setTotal(() => total);
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
    setQuery(() => e.target.value);
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
    setDeleting(true);
    try {
      setAuthToken();
      let res = await axios.delete(
        `${url.BASE_URL}payment/delete-pending-invoice/${assessmentId}`
      );

      setDeleting(false);
      alert(res.data.message);
      router.push('/view/withholding');
    } catch (e) {
      setDeleting(false);
      if (e.response) {
        alert(e.response.message);
      }
    }
  };
  const deletePrompt = (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteHandler(assessmentId);
    }
  };

  return (
    <>
      <SectionTitle title="View Uploads" subtitle="Withholding Tax" />
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
          {post[0]?.status === 'Unpaid' ? (
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
                    disabled={deleting}
                    onClick={() => deletePrompt(post[0]?.assessmentId)}
                  >
                    {`${deleting ? 'Deleting...' : 'Delete'}`}
                    <Loader
                      visible={deleting}
                      type="TailSpin"
                      color="white"
                      height={18}
                      width={18}
                      timeout={0}
                      className="ml-2"
                    />
                  </DeleteButton>
                </div>
              </div>
            </>
          ) : post[0]?.status === 'Paid' ? (
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
          {query !== '' ? (
            <>
              <ViewWhtSingleTable remittance={searchedPost} />
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
              <ViewWhtSingleTable total={total} remittance={currentPosts} />
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

export default ViewWhtSingle;
