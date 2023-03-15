import SectionTitle from '../section-title';
import Widget from '../widget';
import { NewFormInput } from '../FormInput/formInputs';
import { ViewWhtTable } from '../tables/viewWht';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CustomPagination } from '../pagination/customPagination';
import url from '../../config/url';
import setAuthToken from '../../functions/setAuthToken';
import { formatNumber } from '../../functions/numbers';
import dateformat from 'dateformat';
import Loader from 'react-loader-spinner';
import { useRouter } from 'next/router';

const View = () => {
  const [post, setPost] = useState(() => []);
  const [total, setTotal] = useState(() => null);
  const [isFetching, setIsFetching] = useState(() => true);
  const [currentPage, setCurrentPage] = useState(() => 1);
  const [postPerPage, setPostPerPage] = useState(() => 10);
  const router = useRouter();
  const [query, setQuery] = useState(() => '');
  useEffect(() => {
    setAuthToken();
    const fetchPost = async () => {
      try {
        let res = await axios.get(`${url.BASE_URL}withholding/view-schedule`);
        res = res.data.body;
        let records = [];
        let total = [];
        for (let i = 0; i < res.length; i++) {
          let rec = res[i];
          total.push(rec.totalWithholdingAmount);
          rec.totalContractAmount = formatNumber(rec.totalContractAmount);
          rec.totalWithholdingAmount = formatNumber(rec.totalWithholdingAmount);
          rec.period = rec.payPeriod;
          rec.payPeriod = dateformat(rec.payPeriod, 'mmm yyyy');
          records.push(rec);
        }
        setIsFetching(false);
        setPost(() => records);
        total = total.reduce((preVal, curVal) => preVal + curVal);
        setTotal(() => total);
      } catch (e) {
        setIsFetching(false);
        console.log(e.response);
      }
    };
    fetchPost();
  }, []);

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
    data = rows.filter(
      (rows) => rows.payPeriod.toLowerCase().indexOf(query) > -1
    );
    res.push(data);
    return data;
  };
  const searchedPost = search(post).slice(indexOfFirstPost, indexOfLastPost);
  return (
    <>
      <SectionTitle title="View Uploads" subtitle="Withholding Tax Returns" />
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
        <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
          <div className="w-32">
            <NewFormInput
              label="Search by date"
              required
              onChange={searchHandler}
            />
          </div>
        </div>

        <div className="mt-4">
          {query !== '' ? (
            <>
              <ViewWhtTable remittance={searchedPost} />
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
              <ViewWhtTable remittance={currentPosts} total={total} />
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

export default View;
