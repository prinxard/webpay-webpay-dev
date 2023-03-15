import Widget from '../widget';
import { formatNumber } from '../../functions/numbers';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { SuccessIcon, PendingIcon } from '../Icons';

const fields = [
  {
    name: 'TRANSACTION REF',
    key: 'ref',
  },
  {
    name: 'DATE',
    key: 'tran_date',
  },
  {
    name: 'AMOUNT',
    key: 'amount',
  },
  {
    name: 'AGENCY/MDA',
    key: 'mdaName',
  },
  {
    name: 'REVENUE ITEM',
    key: 'itemName',
  },
  {
    name: 'CHANNEL',
    key: 'pmt_meth',
  },
  {
    name: 'STATUS',
    key: 'status',
  },
];

export const Table = (remittance) => {
  let items = remittance.recentRemittance;

  items?.map((remittance) => {
    remittance['amount'] = formatNumber(remittance['amount']);
    if (remittance['status'] === 1 || remittance['status'] === 0) {
      remittance['status'] = 'success';
      remittance['icon'] = <SuccessIcon />;
    } else if (remittance['status'] === 2) {
      remittance['status'] = 'pending';
      remittance['icon'] = <PendingIcon />;
    }
    return remittance;
  });

  return (
    <>
      <Widget>
        <table className="table divide-y divide-green-400 w-full">
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
            {items?.length === 0 && (
              <tr className="">
                <td className="font-semibold text-base"></td>
                <td className="font-semibold text-base"></td>
                <td className="font-semibold text-base"></td>
                <td className="font-semibold text-base">No records</td>
              </tr>
            )}

            {items?.map((remittance, i) => (
              <tr key={i}>
                {fields.map((field) => (
                  <td key={uuidv4()}>
                    {remittance['status'] === 'success' ? (
                      <Link href={`/receipt/${remittance['ref']}`}>
                        <a className="hover:text-blue-500">
                          {field.name === 'STATUS' ? (
                            <div className="flex items-center">
                              {remittance[field.key]}
                              <span className="ml-2">{remittance['icon']}</span>
                            </div>
                          ) : (
                            remittance[field.key]
                          )}
                        </a>
                      </Link>
                    ) : (
                      <Link href={`/pending-payment/${remittance['ref']}`}>
                        <a className="hover:text-blue-500">
                          {field.name === 'STATUS' ? (
                            <div className="flex items-center">
                              {remittance[field.key]}
                              <span className="ml-2">{remittance['icon']}</span>
                            </div>
                          ) : (
                            remittance[field.key]
                          )}
                        </a>
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    </>
  );
};
