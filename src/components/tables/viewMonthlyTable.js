import Widget from '../widget';
import Link from 'next/link';
import { formatNumber } from '../../functions/numbers';
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
    name: 'Total Salary',
    key: 'totalSalary',
  },
  {
    name: 'Total Chargeable',
    key: 'totalChargeable',
  },

  {
    name: 'Total Tax',
    key: 'totalTax',
  },
];

export const ViewMonthlyTable = ({ remittance, total }) => {
  const items = remittance;

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
              {items.map((remittance, i) => (
                <tr key={i} className="">
                  {fields.map((field, j) => (
                    <td key={j} className="">
                      <Link
                        href={`/view/monthly/${
                          remittance['assessmentId'] || remittance['ref']
                        }`}
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

const singleFields = [
  { name: 'Status', key: 'status' },

  {
    name: 'Tax ID',
    key: 'KGTIN',
  },
  {
    name: 'Name',
    key: 'name',
  },
  {
    name: 'Salary',
    key: 'salary',
  },
  {
    name: 'Chargeable',
    key: 'chargeable',
  },
  {
    name: 'Total Relief',
    key: 'totalRelief',
  },

  {
    name: 'Tax',
    key: 'tax',
  },
];

export const ViewMonthlyTableSingle = ({ remittance, total }) => {
  const items = remittance;

  return (
    <>
      <Widget>
        <div className="overflow-x-auto">
          <table className="table divide-y">
            <thead className="">
              <tr className="font-semibold text-blue-400">
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
                  <td>{formatNumber(total.totalSalary)}</td>
                  <td>{formatNumber(total.totalChargeable)}</td>
                  <td>{formatNumber(total.totalRelief)}</td>
                  <td>{formatNumber(total.totalTax)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Widget>
    </>
  );
};
