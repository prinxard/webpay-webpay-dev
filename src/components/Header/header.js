import { KgirsLogo, Home } from "../Images/Images";
import Link from "next/link";
export const Header = (props) => {
  return (
    <div className="header w-full font-serif py-10 lg:px-10 md:px-4 px-2">
      <div className="flex justify-between items-center">
        <div className="">
          <KgirsLogo />
        </div>
        <div className="block">
          <h1 className="lg:text-6xl text-4xl text-gray-300 font-sans font-bold opacity-25">
            eTax
          </h1>
          <p className="lg:text-4xl text-gray-300 font-sans font-bold">
            {props.title ? props.title : "Tax Payment"}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="mr-1">
            <Home />
          </div>
          <p className="text-white font-sans font-bold">
            <Link href="/">
              <a>Back to home</a>
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .header {
          background-image: linear-gradient(
            126deg,
            rgba(120, 193, 17, 0.79) 0%,
            rgba(0, 68, 46, 0.92) 100%
          );
        }
      `}</style>
    </div>
  );
};

export default Header;
