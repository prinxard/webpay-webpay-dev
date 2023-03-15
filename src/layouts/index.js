import { useRouter } from "next/router";
import Centered from "./centered";
import Layout2 from "./layout-2";

const Layouts = ({ children }) => {
  const router = useRouter();
  let { pathname } = { ...router };

  if (["/404", "/500"].includes(pathname)) {
    return <Centered>{children}</Centered>;
  }

  return <Layout2>{children}</Layout2>;
};

export default Layouts;
