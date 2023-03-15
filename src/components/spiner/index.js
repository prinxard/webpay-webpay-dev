import Loader from "react-loader-spinner";
const Spinner = () => {
  return (
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-100 z-50">
      <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
        <Loader
          visible={true}
          type="Bars"
          color="blue"
          height={32}
          width={32}
          timeout={0}
        />
      </span>
    </div>
  );
};
export const AuthSpinner = () => {
  return (
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-100 z-50">
      <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
        <Loader
          visible="true"
          type="TailSpin"
          color="green"
          height={32}
          width={32}
          timeout={0}
        />
      </span>
    </div>
  );
};

export const ProcessorSpinner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen  z-50 overflow-hidden bg-black opacity-75 flex flex-col items-center justify-center">
      <Loader
        visible={true}
        type="ThreeDots"
        color="white"
        height={32}
        width={32}
        timeout={0}
      />
      <h2 className="text-center text-white text-xl font-semibold">
        Fetching user information...
      </h2>
    </div>
  );
};

export default Spinner;
