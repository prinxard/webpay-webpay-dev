import Widget from '../widget';
import Link from 'next/link';
import { formatNumber } from '../../functions/numbers';

const singleFields = [
  {
    name: 'Date',
    key: 'payPeriod',
  },
  {
    name: 'Status',
    key: 'status',
  },
  {
    name: 'Tax ID',
    key: 'KGTIN',
  },
  {
    name: 'Name',
    key: 'name',
  },
  {
    name: 'Location',
    key: 'location',
  },
  {
    name: 'Invoice Number',
    key: 'invoiceNo',
  },
  {
    name: 'Contract Date',
    key: 'contractDate',
  },
  {
    name: 'Contract Amount',
    key: 'contractAmount',
  },
  {
    name: 'Contract Type',
    key: 'contractType',
  },

  {
    name: 'Tax State',
    key: 'taxState',
  },
  {
    name: 'Withholding Amount',
    key: 'withholdingAmount',
  },
  {
    name: 'Rate(%)',
    key: 'rate',
  },
];

const fields = [
  {
    name: 'Date',
    key: 'payPeriod',
  },
  {
    name: 'Upload Date',
    key: 'uploadDate',
  },
  {
    name: 'Contract Amount',
    key: 'totalContractAmount',
  },
  {
    name: 'Withholding Amount',
    key: 'totalWithholdingAmount',
  },
];

export const ViewWhtTable = ({ remittance, total }) => {
  let items = remittance;

  return (
    <>
      <Widget>
        <div className="overflow-x-auto">
          <table className="table divide-y">
            <thead>
              <tr className="">
                {fields.map((field, i) => (
                  <th key={i} className="">
                    {field.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 && (
                <tr className="">
                  <td className="font-semibold text-base"></td>
                  <td className="font-semibold text-base"></td>
                  <td className="font-semibold text-base">No records</td>
                </tr>
              )}
              {items.map((remittance, i) => (
                <tr key={i} className="">
                  {fields.map((field, j) => (
                    <td key={j} className="">
                      <Link
                        href={`/view/withholding/${remittance['assessmentId']}`}
                      >
                        <a className="hover:text-blue-500">
                          {remittance[field.key]}
                        </a>
                      </Link>
                    </td>
                  ))}
                </tr>
              ))}
              {items.length > 0 && (
                <tr className="font-semibold">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{formatNumber(total)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Widget>
    </>
  );
};

export const ViewWhtSingleTable = ({ remittance, total }) => {
  let items = remittance;

  return (
    <>
      <Widget>
        <div className="overflow-x-auto">
          <table className="table divide-y">
            <thead>
              <tr className="">
                {singleFields.map((field, i) => (
                  <th key={i} className="">
                    {field.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((remittance, i) => (
                <tr key={i} className="">
                  {singleFields.map((field, j) => (
                    <td key={j} className="">
                      {remittance[field.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {items.length > 0 && (
                <tr className="font-semibold">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{formatNumber(total)}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Widget>
    </>
  );
};
