import CustomButton from "../CustomButton/CustomButton";
import { HazardIcon } from "../Icons";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
export const TokenModalsOverlay = ({ children }) => {
  const { backdrop } = useSelector(
    (state) => ({
      backdrop: state.modal.backdrop,
    }),
    shallowEqual
  );
  return (
    <div
      className={`bg-black  bg-opacity-0 absolute inset-0  flex justify-center items-center ${
        backdrop ? "" : "hidden"
      }`}
    >
      {children}
    </div>
  );
};

export const TokenModals = () => {
  const dispatch = useDispatch();
  const { hidden } = useSelector(
    (state) => ({
      hidden: state.modal.hidden,
    }),
    shallowEqual
  );

  const toggleModal = () => {
    dispatch({ type: "TOGGLE_MODAL" });
  };

  return (
    <div
      className={`lg:w-2/5  md:w-4/5 w-4/5 z-10 bg-gray-200  p-10 border shadow-2xl rounded-xl ${
        hidden && "hidden"
      }`}
    >
      <div className="w-full flex justify-center ">
        <div className="text-center">
          <HazardIcon />
          <h1 className="text-lg font-medium ">KGIRS eTax Portal</h1>
          <p className="text-justify font-medium font-sans my-4">
            A six(6) digit token will be sent to the phone number and email used
            in registering for the tax identification number. Use that to
            complete the sign up process.
          </p>

          <CustomButton onClick={toggleModal}> OK </CustomButton>
        </div>
      </div>
    </div>
  );
};
