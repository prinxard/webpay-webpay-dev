import Input from "../FormInput/formInputs";
import CustomButton from "../CustomButton/CustomButton";
import { useRef, useEffect } from "react";
import * as Icons from "../Icons";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  signUpAuth,
  resendToken,
} from "../../redux/signup-auth/signup-auth.actions";
import Loader from "react-loader-spinner";
import { AuthSpinner } from "../spiner/index";

const AuthForm = () => {
  //redux state
  const dispatch = useDispatch();
  const {
    taxId,
    taxPayerName,
    submitting,
    errorMessages,
    isSignUpComplete,
    resendingToken,
    tokenMessage,
    isValid,
  } = useSelector(
    (state) => ({
      taxId: state.signUp.taxId,
      taxPayerName: state.signUp.taxPayerName,
      submitting: state.signUpAuth.submitting,
      errorMessages: state.signUpAuth.errorMessages,
      isSignUpComplete: state.signUpAuth.isSignUpComplete,
      resendingToken: state.signUpAuth.resendingToken,
      tokenMessage: state.signUpAuth.tokenMessage,
      isValid: state.signUp.isValid,
    }),
    shallowEqual
  );
  const router = useRouter();

  //react-hook-form
  const { register, handleSubmit, errors, watch } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const password = useRef({});
  password.current = watch("password", "");

  //submit form
  const SubmitHandler = (data) => {
    let payload = {
      kgtin: data.kgtin,
      token: data.tp_token,
      password: data.password,
    };
    dispatch(signUpAuth(payload));
  };

  useEffect(() => {
    if (isSignUpComplete) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else if (!isValid) {
      router.push("/signup");
    }
  }, [isSignUpComplete]);
  return (
    <>
      {!isValid ? (
        <AuthSpinner />
      ) : (
        <>
          <form onSubmit={handleSubmit(SubmitHandler)} autoComplete="off">
            <div className="w-full p-4">
              {errorMessages !== null && (
                <p className="text-red-500 shadow-md py-2 px-2 border-l-2 border-red-500">
                  {errorMessages}
                </p>
              )}
              {isSignUpComplete && (
                <p className="text-green-500 shadow-md py-2 px-2 border-l-2 border-green-500">
                  Sign up Complete. You may now login with your tax Id and
                  password
                </p>
              )}
              {tokenMessage && (
                <p className="text-green-500 shadow-md py-2 px-2 border-l-2 border-green-500">
                  {tokenMessage}
                </p>
              )}
              <Input
                name={"kgtin"}
                ref={register({ minLength: 10, maxLength: 10 })}
                label={<Icons.KgtinIcon />}
                autoComplete="off"
                required
                placeholder="Tax Id"
                value={taxId}
                type="text"
                readOnly
              />
              {errors.kgtin && errors.kgtin.type === "minLength" && (
                <p className="text-red-600">KGTIN or TIN must be 10 digits</p>
              )}
              {errors.kgtin && errors.kgtin.type === "maxLength" && (
                <p className="text-red-600">KGTIN or TIN must be 10 digits</p>
              )}

              <Input
                name={"tp_name"}
                label={<Icons.TaxpayerIcon />}
                autoComplete="off"
                required
                placeholder="Tax payer Name"
                type="text"
                value={`${taxPayerName.substr(0, 18)}...`}
                readOnly
              />

              <Input
                name={"tp_token"}
                label={<Icons.TokenIcon />}
                autoComplete="off"
                required
                ref={register({
                  minLength: 6,
                  maxLength: 6,
                  pattern: {
                    value: /^[0-9]*[.]?[0-9]*$/,
                    message: "Token must be a number",
                  },
                })}
                placeholder="Enter Token"
                type="text"
              />
              {errors.tp_token && errors.tp_token.type === "minLength" && (
                <p className="text-red-600">Token must be 6 digits</p>
              )}
              {errors.tp_token && errors.tp_token.type === "maxLength" && (
                <p className="text-red-600">Token must be 6 digits</p>
              )}
              {errors.tp_token && (
                <p className="text-red-600 bg-white">
                  {errors.tp_token.message}
                </p>
              )}
              <Input
                name={"password"}
                label={<Icons.PasswordIcon />}
                autoComplete="off"
                required
                placeholder="Enter Password"
                type="password"
                ref={register({
                  required: "Please enter a Password",
                  minLength: {
                    value: 8,
                    message: "Must be 8 characters or more",
                  },
                  validate: (value) => {
                    return (
                      [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every(
                        (pattern) => pattern.test(value)
                      ) ||
                      "Must include lower, upper, number, and special characters"
                    );
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <Input
                name={"confPassword"}
                label={<Icons.PasswordIcon2 />}
                autoComplete="off"
                required
                placeholder="Enter Password again"
                type="password"
                ref={register({
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                })}
              />
              {errors.confPassword && (
                <p className="text-red-500">{errors.confPassword.message}</p>
              )}

              <div className="mt-4 w-24">
                <CustomButton name="Submit" type="submit" disabled={submitting}>
                  Submit
                  <Loader
                    visible={submitting}
                    type="TailSpin"
                    color="#00FA9A"
                    height={18}
                    width={18}
                    timeout={0}
                    className="ml-2"
                  />
                </CustomButton>
              </div>

              <div className="mt-4">
                <p>
                  Didn't get a token?
                  <button
                    className="text-green-500 ml-1"
                    type="button"
                    onClick={() => dispatch(resendToken({ taxId }))}
                  >
                    {`${resendingToken ? "Resending..." : "Resend"}`}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default AuthForm;
