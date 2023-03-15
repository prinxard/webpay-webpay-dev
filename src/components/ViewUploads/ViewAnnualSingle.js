import SectionTitle from "../section-title";
import Widget from "../widget";
import { NewFormInput } from "../FormInput/formInputs";
import { ViewAnnualTable } from "../tables/viewAnnual";
import { useEffect, useState } from "react";
import axios from "axios";
import { CustomPagination } from "../pagination/customPagination";
import { useRouter } from "next/router";

const ViewAnnual = () => {
  const [post, setPost] = useState(() => []);
  const [currentPage, setCurrentPage] = useState(() => 1);
  const [postPerPage, setPostPerPage] = useState(() => 10);
  const [query, setQuery] = useState(() => "");
  const router = useRouter();
  const id = router.query;
  const ref = id.ref;
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${ref}`
        );
        let single = [];
        single.push(res.data);
        setPost(() => single);
      } catch (e) {}
    };
    fetchPost();
  }, [ref]);

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
    data = rows.filter((rows) => rows.title.toLowerCase().indexOf(query) > -1);
    res.push(data);

    return data;
  };

  const searchedPost = search(post).slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <SectionTitle title="View Uploads" subtitle="Annual PAYE Returns" />
      <Widget>
        <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
          <div className="w-full lg:w-1/12">
            <NewFormInput
              label="Search by year"
              required
              onChange={searchHandler}
            />
          </div>
        </div>

        <div className="mt-4">
          {query !== "" ? (
            <>
              <ViewAnnualTable posts={searchedPost} />
              <CustomPagination
                paginate={paginate}
                totalPosts={res[0].length}
                postPerPage={postPerPage}
                currentPage={currentPage}
                next={next}
                previous={previous}
              />
            </>
          ) : post.length > 10 ? (
            <>
              <ViewAnnualTable posts={currentPosts} />
              <CustomPagination
                paginate={paginate}
                totalPosts={post.length}
                postPerPage={postPerPage}
                currentPage={currentPage}
                next={next}
                previous={previous}
              />
            </>
          ) : (
            <>
              <ViewAnnualTable posts={post} />
            </>
          )}
        </div>
      </Widget>
    </>
  );
};

export default ViewAnnual;
