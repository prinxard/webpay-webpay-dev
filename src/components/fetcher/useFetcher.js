import useSWR from "swr";
import axios from "axios";

const UseFetcher = (url, initialData) => {
  const { data, error } = useSWR(
    url,
    async (url) => {
      const res = await axios(url);
      return res.data.body;
    },
    { initialData }
  );

  return {
    data,
    isLoading: !error && Object.keys(data).length === 0,
    isError: error,
  };
};
export default UseFetcher;
