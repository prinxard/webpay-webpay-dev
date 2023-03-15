import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Index = ({ res }) => {
  const [query, setQuery] = useState(() => '');
  const [msg, setMsg] = useState(() => '');

  const router = useRouter();
  useEffect(() => {
    if (router && router.query) {
      let message = router.query.msg;
      setMsg(message)
      // const fetchPost = async () => {
      //   try {


      //   } catch (e) {
      //     console.log(e);
      //   }
      // };
      // fetchPost();
    }
  }, [router]);
  return (
    <div className="w-full">
      <div className="p-10">
        <p className="text-center text-red-400 text-lg">
          {/* Payment was not successful. Please try again after some time. */}
          {msg}
        </p>
      </div>
    </div>
  );
};

export default Index;
