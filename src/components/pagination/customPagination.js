export const PageWithText = ({
  activeClassNames = 'btn btn-default bg-blue-500 hover:bg-blue-600 text-white',
  inactiveClassNames = 'btn btn-default bg-transparent hover:bg-gray-200 text-gray-900 dark:text-white',
  children,
  onClick,
}) => {
  return (
    <>
      <button onClick={onClick} className={inactiveClassNames}>
        {children}
      </button>
    </>
  );
};

export const Page = ({
  activeClassNames = 'btn btn-circle bg-blue-500 hover:bg-blue-600 text-white',
  inactiveClassNames = 'btn btn-circle bg-transparent hover:bg-gray-200 text-gray-900 dark:text-white',
  children,
  active = false,
  onClick,
}) => {
  if (active) {
    return (
      <button onClick={onClick} className={activeClassNames}>
        {children}
      </button>
    );
  }
  return (
    <button onClick={onClick} className={inactiveClassNames}>
      {children}
    </button>
  );
};

export const Pages = ({
  currentPage,
  paginate,
  totalPosts,
  postPerPage,
  setNext,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      {pageNumbers.map((number) => (
        <Page
          onClick={() => paginate(number, setNext)}
          active={number === currentPage ? true : false}
          key={number}
        >
          {number}
        </Page>
      ))}
    </>
  );
};

export const CustomPagination = ({
  totalPosts,
  postPerPage,
  active,
  previous = true,
  next,
  icons = false,
  paginate,
  currentPage,
  setNextPage,
  setPreviousPage,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-start space-x-2 pagination">
      {totalPosts > 1 && currentPage !== 1 && (
        <PageWithText onClick={() => previous(currentPage, setPreviousPage)}>
          Previous
        </PageWithText>
      )}
      <Pages
        currentPage={currentPage}
        totalPosts={totalPosts}
        postPerPage={postPerPage}
        active={active}
        paginate={paginate}
        previous={previous}
        setNext={setNextPage}
      />
      {totalPosts > 1 &&
        totalPosts >= 10 &&
        currentPage !== totalPosts / postPerPage && (
          <PageWithText
            currentPage={currentPage}
            onClick={() => next(currentPage, setNextPage)}
          >
            Next
          </PageWithText>
        )}
    </div>
  );
};
