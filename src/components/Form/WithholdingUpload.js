import { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, shallowEqual } from 'react-redux';
import SectionTitle from '../section-title';
import Widget from '../widget';
import Link from 'next/link';
import { SubmitButton } from '../CustomButton/CustomButton';
import axios from 'axios';
import url from '../../config/url';
import { FiX, FiCheck } from 'react-icons/fi';
import { Select, SelectMonth } from '../forms/selects';
import { SampleCsvWithholding, WithholdingInterest } from '../Images/Images';
import { FiArrowDown } from 'react-icons/fi';
import setAuthToken from '../../functions/setAuthToken';
import { useRouter } from 'next/router';
import { ProcessorSpinner } from '../spiner/index';

const WithholdingUploadForm = () => {
  //handle file
  const [file, setFile] = useState(null);
  const [withholdingType, setWithholdingType] = useState('Contract');
  const [uploadErrors, setUploadErrors] = useState(() => []);
  const [submitting, setSubmitting] = useState(() => false);
  const [disabled, setDisabled] = useState(true);
  const modalRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(() => false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { palettes } = useSelector(
    (state) => ({
      palettes: state.palettes,
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
    setUploadErrors(() => []);
    if (uploadSuccessful) {
      router.push('/view/withholding');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!modalRef || !modalRef.current) return false;
      if (!open || modalRef.current.contains(event.target)) {
        return false;
      }
      setOpen(!open);
      setUploadErrors(() => []);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, modalRef]);

  const fileInputRef = useRef();
  const fileHandler = (event) => {
    const file = event.target.files[0];
    const filetype = ['application/vnd.ms-excel', 'text/csv'];

    if (!file) {
      setFile(null);
      setDisabled(true);
      return;
    }

    if (!filetype.includes(file.type)) {
      alert('file type not allowed. only csv(delimited comma) are allowed.');
      setFile(null);
      setDisabled(true);
      return;
    } else {
      setFile(file);
      setDisabled(false);
      return;
    }
  };

  //handle submit
  const handleUpload = async (data) => {
    let payPeriod = `${data.year}-${data.month}-01`;
    const formData = new FormData();
    formData.append('payPeriod', payPeriod);
    formData.append('uploadType', data.uploadType);
    formData.append('csv', file);

    setAuthToken();
    setSubmitting(() => true);
    try {
      await axios.post(`${url.BASE_URL}withholding/upload-schedule`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (ProgressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );
        },
      });
      setUploadPercentage(0);
      setFile(null);
      setDisabled(true);
      setSubmitting(() => false);
      setUploadSuccessful(() => true);
      show();
    } catch (error) {
      setUploadPercentage(0);
      setFile(null);
      setDisabled(true);
      setSubmitting(false);
      if (error.response) {
        console.log(error.response.data);
        setUploadErrors(() => error.response.data.body);
        show();
      }
    }
  };

  return (
    <>
      {submitting && (
        <ProcessorSpinner
          visible={true}
          text={`${
            uploadPercentage === 0
              ? 'Uploading...'
              : uploadPercentage === 100
              ? 'Processing...'
              : null
          }`}
        />
      )}
      <SectionTitle title="Schedule Uploads" subtitle="Withholding Tax" />
      <Widget>
        <form onSubmit={handleSubmit(handleUpload)}>
          <div className="flex flex-col lg:flex-row lg:flex-wrap w-full lg:space-x-4">
            <div className="w-full  lg:w-1/3">
              <div className="flex justify-between items-center">
                <Select
                  label="Select Year"
                  required
                  ref={register()}
                  name="year"
                />
                <SelectMonth
                  label="Select Month"
                  ref={register()}
                  required
                  name="month"
                />
                <div className={`form-element`}>
                  <div className="form-label">Select Upload Type</div>
                  <select
                    name="uploadType"
                    className="form-select"
                    ref={register()}
                    onChange={(e) => setWithholdingType(e.target.value)}
                  >
                    <option value="Contract">Contract</option>
                    <option value="Interest">Interest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <input
                required
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={fileHandler}
                onClick={(e) => (e.target.value = null)}
              />
              <div className="flex items-center">
                <button
                  className="btn btn-default btn-outlined bg-transparent mr-4"
                  onClick={(event) => {
                    event.preventDefault();
                    fileInputRef.current.click();
                  }}
                >
                  select file
                </button>
                <p>{file ? file.name : 'no file chosen yet'}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <SubmitButton type="submit" disabled={disabled}>
              Submit
            </SubmitButton>
          </div>
        </form>

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
                <div className="bg-white  text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none">
                  <div className="relative p-4 flex-auto">
                    <div className="flex items-start justify-start p-2 space-x-4">
                      <div className="flex-shrink-0 w-12">
                        {uploadErrors.length > 0 ? (
                          <span className="h-10 w-10 bg-red-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                            <FiX
                              size={18}
                              className="stroke-current text-red-500"
                            />
                          </span>
                        ) : uploadSuccessful ? (
                          <span className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                            <FiCheck
                              size={18}
                              className="stroke-current text-green-500"
                            />
                          </span>
                        ) : null}
                      </div>
                      <div className="w-full">
                        <div className="text-lg mb-2 font-bold">
                          {uploadErrors.length > 0 ? (
                            <span>Failed to Upload</span>
                          ) : uploadSuccessful ? (
                            <span>Upload Successful</span>
                          ) : null}
                        </div>
                        <div className="overflow-auto max-h-64">
                          {uploadErrors.length > 0 &&
                            uploadErrors.map((err, i) => (
                              <li className="text-red-500" key={i}>
                                {err}
                              </li>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700 border-solid rounded-b space-x-2">
                    <button
                      className="btn btn-default btn-rounded bg-white hover:bg-gray-100 text-gray-900"
                      type="button"
                      onClick={hide}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {withholdingType === 'Contract' ? (
          <div className="flex justify-end mt-4">
            <div>
              <div className="flex justify-center">
                <div className="flex">
                  <Link href="/csv/wht.csv">
                    <a className="flex overflow-hidden btn btn-default btn-outlined  mr-4 bg-transparent text-green-500 hover:text-green-700 border-green-500 hover:border-green-700">
                      <FiArrowDown size="16" className="animate-bounce" />{' '}
                      Download sample CSV
                    </a>
                  </Link>

                  <Link href="#">
                    <a className="flex overflow-hidden btn btn-default btn-outlined  mr-4 bg-transparent text-blue-500 hover:text-blue-700 border-blue-500 hover:border-blue-700">
                      User Guide
                    </a>
                  </Link>
                </div>
              </div>
              <p className="text-center text-xl">Sample Csv</p>

              <SampleCsvWithholding />
            </div>
          </div>
        ) : withholdingType === 'Interest' ? (
          <div className="flex justify-end mt-4">
            <div>
              <div className="flex justify-center">
                <div className="flex">
                  <Link href="/csv/wht_interest.csv">
                    <a className="flex overflow-hidden btn btn-default btn-outlined  mr-4 bg-transparent text-green-500 hover:text-green-700 border-green-500 hover:border-green-700">
                      <FiArrowDown size="16" className="animate-bounce" />{' '}
                      Download sample CSV
                    </a>
                  </Link>

                  <Link href="#">
                    <a className="flex overflow-hidden btn btn-default btn-outlined  mr-4 bg-transparent text-blue-500 hover:text-blue-700 border-blue-500 hover:border-blue-700">
                      User Guide
                    </a>
                  </Link>
                </div>
              </div>
              <p className="text-center text-xl">Sample Csv</p>

              <WithholdingInterest />
            </div>
          </div>
        ) : null}
      </Widget>
    </>
  );
};

export default WithholdingUploadForm;
