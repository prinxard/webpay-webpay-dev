import Header from "../../components/Header/header";
import { useRouter } from "next/router";
const Layout2 = ({ children }) => {
  const router = useRouter();
  let { pathname } = { ...router };

  if (["/get-receipt"].includes(pathname)) {
    return (
      <div>
        <Header title="e-Receipt" />
        <div>{children}</div>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default Layout2;
