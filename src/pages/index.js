import NewPaymentForm from "../components/Form/taxPayForm";
import url from "../config/url";

const Login = ({ res }) => {
  return (
    <div className="w-full">
      <div className="p-10">
        <NewPaymentForm res={res} />
      </div>
    </div>
  );
};

export default Login;
export async function getServerSideProps(context) {
  let data;
  try {
    const res = await fetch(`${url.BASE_URL}web/get-mdas-items`);
    data = await res.json();
    data = data.body;
  } catch (error) {
    data = {};
  }

  return {
    props: {
      res: data,
    },
  };
}
