import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import SectionTitle from '../section-title';
import Widget from '../widget';
import { NewFormInput } from '../FormInput/formInputs';
import axios from 'axios';
import setAuthToken from '../../functions/setAuthToken';
import Loader from 'react-loader-spinner';
import { SubmitButton } from '../CustomButton/CustomButton';
import url from '../../config/url';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useSelector, shallowEqual } from 'react-redux';
import { FiSend } from 'react-icons/fi';
import { formatNumber } from '../../functions/numbers';
import Spinner from '../spiner';
import { v4 as uuidv4 } from 'uuid';

const NewPaymentForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const [loader, setLoader] = useState(() => 'true');
  const [personalInfo, setPersonalInfo] = useState({
    KGTIN: '',
    address: '',
    tp_name: '',
    phone_number: '',
    tp_type: '',
    tax_office: '',
    email: '',
  });
  const [modalData, setModalData] = useState(() => []);
  const [submitting, setSubmitting] = useState(() => false);
  const [mda, setMda] = useState(() => []);
  const [item, setItem] = useState(() => []);
  const modalRef = useRef(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { palettes, isLoggedIn } = useSelector(
    (state) => ({
      palettes: state.palettes,
      isLoggedIn: state.authentication.auth,
    }),
    shallowEqual
  );
  let { background } = {
    ...palettes,
  };

  const show = () => {
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      setAuthToken();
      const fetch = async () => {
        try {
          const res = await axios.get(`${url.BASE_URL}user/new-payment`);

          setPersonalInfo(() => res.data.body[0]);
          const mda = res.data.body.slice(1);
          setMda(() => mda);
          setLoader(() => 'false');
        } catch (err) {
          setLoader(() => 'false');
          alert(
            'something went wrong. Please check your internet and try again'
          );
        }
      };
      fetch();
    }
  }, [isLoggedIn]);

  const mySet = new Set();
  for (let i = 0; i < mda.length; i++) {
    const e = mda[i];
    mySet.add(e.mda);
  }

  let arr = [...mySet];
  const filterItem = (e) => {
    let da = e.target.value;
    const itemName = mda.filter((md) => md.mda === da);
    setItem(() => itemName);
  };
  //submit handler
  const SubmitHandler = (data) => {
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    if (month < 10) {
      month = `0${month}`;
    }
    const date = `${year}-${month}-${day}`;
    const ref = `${year}${month}${day}${Date.now()}`;
    data.ref = ref;
    data.transactionDate = date;
    const agency = data.revenueItem.split('/')[0];
    data.agency = agency;
    data.itemName = mda.filter(
      (mda) => mda.rev_code === data.revenueItem
    )[0].item;
    let myArr = [];
    myArr.push(data);
    setModalData(() => myArr);
    show();
  };

  const submit = async (data) => {
    setAuthToken();
    setSubmitting(() => true);

    try {
      setSubmitting(() => false);
      const res = await axios.post(`${url.BASE_URL}payment/new-payment`, {
        transactionDate: data.transactionDate,
        agency: data.agency,
        revenueSub: data.revenueItem,
        taxPayer: data.KGTIN,
        amount: data.amount,
        station: data.taxOffice,
        status: '2',
        ref: data.ref,
        paymentMethod: data.channel,
      });

      if (res.data.status === 200) {
        try {
          Cookie.set('__id', data);
          if (data.channel === 'eTransact') {
            router.push('/payment/eTransact');
          }
        } catch (e) {
          alert('there was an error. Please try again');
        }
      } else {
        alert('there was an error. Please try again');
      }
    } catch (e) {
      setSubmitting(() => false);
      console.log(e);
      if (e.response) {
        console.log(e.response);
      }
    }
  };

  return (
    <>
      {loader === 'true' && <Spinner isVisible={loader} />}
      <SectionTitle title="Make Payment" subtitle="New Payment" />

      <Widget
        title="Kindly ensure that all the information provided are accurate and true."
        description={
          <span>Note that all fields with asterisk (*) must be completed</span>
        }
      >
        <form onSubmit={handleSubmit(SubmitHandler)}>
          <div>
            <h1 className="text-base font-semibold">Personal Information</h1>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="KGTIN/TIN"
                  required
                  ref={register}
                  value={personalInfo.KGTIN}
                  name="KGTIN"
                  onChange={() => {}}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Name"
                  ref={register}
                  required
                  value={personalInfo.tp_name}
                  name="name"
                  onChange={() => {}}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Phone Number"
                  ref={register}
                  required
                  value={personalInfo.phone_number}
                  name="phoneNumber"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Taxpayer Type"
                  required
                  ref={register}
                  value={personalInfo.tp_type}
                  name="taxPayerType"
                  onChange={() => {}}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Tax Station"
                  required
                  ref={register}
                  value={personalInfo.tax_office}
                  name="taxOffice"
                  onChange={() => {}}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <NewFormInput
                  label="Email Address"
                  required
                  ref={register}
                  value={personalInfo.email}
                  name="email"
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-8 ">
              <div className="w-full lg:w-1/2">
                <NewFormInput
                  label="Residential Address"
                  required
                  ref={register}
                  value={personalInfo.address}
                  name="address"
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-8 "></div>
          </div>

          <div>
            <h1 className="text-base mt-2 mb-4 font-semibold">
              Payment Information
            </h1>
            <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
              <div className="w-full lg:w-1/4">
                <select
                  onChange={filterItem}
                  required
                  ref={register({ required: true })}
                  name="mda"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select MDA</option>
                  {arr.map((md, i) => (
                    <option value={md} key={i}>
                      {md}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full lg:w-1/4">
                <select
                  required
                  ref={register({ required: true })}
                  name="revenueItem"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select Item</option>
                  {item.map((item, i) => (
                    <option value={item.rev_code} key={item.serial}>
                      {item.item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full lg:w-1/4">
                <select
                  required
                  ref={register({ required: true })}
                  name="channel"
                  className="w-full  focus:outline-none focus:ring-0 focus:ring-offset-0  border-transparent bg-transparent text-gray-600 text-md border-none"
                >
                  <option value="">Select Payment Channel</option>
                  {/* <option value="Remita">Remita</option> */}
                  <option value="eTransact">eTransact</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4 mt-2 mb-4">
            <div className="w-full lg:w-1/4">
              <NewFormInput
                label="Amount"
                required
                ref={register({
                  minLength: 4,
                  pattern: {
                    value: /^[0-9]*[.]?[0-9]*$/,
                    message: 'Amount must be a number',
                  },
                })}
                name="amount"
              />
              {errors.amount && errors.amount.type === 'minLength' && (
                <p className="text-red-600">
                  Amount cannot be less than {formatNumber(1000)}
                </p>
              )}
              {errors.amount && (
                <p className="text-red-600 bg-white">{errors.amount.message}</p>
              )}
            </div>

            <div className="w-full lg:w-1/4">
              <NewFormInput
                label="Description"
                required
                ref={register}
                name="description"
              />
            </div>
          </div>
          <SubmitButton text="Make Payment">Make Payment</SubmitButton>
        </form>
      </Widget>

      {open && (
        <>
          <div className="modal-backdrop fade-in"></div>
          <div
            className={`modal show ${background === 'dark' ? 'dark' : ''}`}
            data-background={background}
          >
            <div
              className="relative w-auto lg:my-4 mx-auto lg:max-w-lg max-w-sm"
              ref={modalRef}
            >
              <div className="bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none">
                <div className="relative p-4 flex-auto">
                  <div className="flex items-start justify-start p-2 space-x-4">
                    <div className="flex-shrink-0 w-12">
                      <span className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                        <FiSend
                          size={18}
                          className="stroke-current text-green-500"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-lg mb-2 font-bold">
                        <span>Payment Confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {modalData.length > 0 &&
                    modalData.map((dat) => {
                      return (
                        <div key={uuidv4()}>
                          <div className="p-2 text-sm">
                            <table className="table-fixed w-full">
                              <tbody className="divide-y">
                                <tr>
                                  <td>KGTIN</td>
                                  <td>{dat.KGTIN}</td>
                                </tr>
                                <tr className="">
                                  <td>Phone Number</td>
                                  <td>{dat.phoneNumber}</td>
                                </tr>
                                <tr>
                                  <td>email</td>
                                  <td>{dat.email}</td>
                                </tr>
                                <tr>
                                  <td>Agency</td>
                                  <td>{dat.mda}</td>
                                </tr>
                                <tr>
                                  <td>Revenue Item</td>
                                  <td>{dat.itemName}</td>
                                </tr>
                                <tr>
                                  <td>Amount</td>
                                  <td>{formatNumber(dat.amount)}</td>
                                </tr>
                                <tr>
                                  <td>Description</td>
                                  <td>{dat.description}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="flex items-center justify-end p-4  dark:border-gray-700 border-solid rounded-b space-x-2">
                  <SubmitButton
                    onClick={() => submit(modalData[0])}
                    disabled={submitting}
                  >
                    Confirm Payment{' '}
                    <Loader
                      visible={submitting}
                      type="TailSpin"
                      color="white"
                      height={19}
                      width={19}
                      timeout={0}
                      className="ml-2"
                    />
                  </SubmitButton>
                  <button
                    className="btn btn-default btn-rounded bg-white hover:bg-gray-100 text-gray-900"
                    type="button"
                    onClick={hide}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default NewPaymentForm;
