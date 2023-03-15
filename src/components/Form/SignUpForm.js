import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Input from '../FormInput/formInputs';
import { FormHeader } from '../FormHeader/FormHeader';
import CustomButton from '../CustomButton/CustomButton';
import { KgtinIcon } from '../Icons';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { signUp, resetSubmitting } from '../../redux/signup/signup.actions';
import Loader from 'react-loader-spinner';
import { useRouter } from 'next/router';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  //state
  const { enableInput, submitting, signUpErrors, isValid } = useSelector(
    (state) => ({
      enableInput: state.modal.input,
      submitting: state.signUp.submitting,
      isValid: state.signUp.isValid,
      signUpErrors: state.signUp.errorMessages,
    }),
    shallowEqual
  );
  useEffect(() => {
    if (isValid) {
      router.push('/signup/auth');
    }
    dispatch(resetSubmitting());
  }, [isValid]);

  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const SubmitHandler = (taxId) => {
    dispatch(signUp(taxId));
  };

  return (
    <form onSubmit={handleSubmit(SubmitHandler)} autoComplete="off">
      <div className="w-full">
        <FormHeader text="Enter your Tax Id to sign up" />
        {signUpErrors !== null && (
          <p className="border-red-500 border-l-2 text-red-500 p-2">
            {signUpErrors}
          </p>
        )}
        <Input
          name={'kgtin'}
          ref={register({
            minLength: 10,
            maxLength: 10,
            pattern: {
              value: /^[0-9]*[.]?[0-9]*$/,
              message: 'Tax Id must be a number',
            },
          })}
          label={<KgtinIcon />}
          autoComplete="off"
          required
          placeholder="Tax Id"
          disabled={enableInput}
          type="text"
        />
        {errors.kgtin && errors.kgtin.type === 'minLength' && (
          <p className="text-red-600">Tax Id must be 10 digits</p>
        )}
        {errors.kgtin && errors.kgtin.type === 'maxLength' && (
          <p className="text-red-600">Tax Id must be 10 digits</p>
        )}
        {errors.kgtin && (
          <p className="text-red-600 bg-white">{errors.kgtin.message}</p>
        )}

        <div className="mt-8 w-24">
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

        <div className="mt-6">
          <p>
            Already have an account?
            <Link href="/">
              <a className="text-green-500"> Login</a>
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
