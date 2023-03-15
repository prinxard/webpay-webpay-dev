import Widget from "../widget";
import { formatNumber } from "../../functions/numbers";
import Link from "next/link";

// const fields = [
//   {
//     name: "Tax ID",
//     key: "id",
//   },
//   {
//     name: "Name",
//     key: "name",
//   },
//   {
//     name: "Gross Salary",
//     key: "gross-salary",
//   },
//   {
//     name: "Number of Months",
//     key: "months",
//   },
//   {
//     name: "Relief Allowance",
//     key: "relief-allowance",
//   },
//   {
//     name: "Net tax deducted",
//     key: "net-tax",
//   },
//   {
//     name: "Expected tax",
//     key: "exp-tax",
//   },
//   {
//     name: "Variance",
//     key: "variance",
//   },
//   {
//     name: "Remark",
//     key: "remark",
//   },
// ];
const fields = [{ name: "title" }, { name: "userId" }];

export const ViewAnnualTable = ({ remittance, posts }) => {
  // let items = remittance;
  // remittance.map((remittance) => {
  //   remittance["amount"] = formatNumber(remittance["amount"]);
  //   if (remittance["status"] === 1) {
  //     remittance["status"] = "success";
  //   } else if (remittance["status"] === 0) {
  //     remittance["status"] = "failed";
  //   }
  //   return remittance;
  // });
  // console.log(items);

  return (
    <>
      <Widget>
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
            {/* {items.slice(0, 5).map((remittance, i) => (
              <tr key={i} className="">
                {fields.map((field, j) => (
                  <td key={j} className="">
                    <Link href={`/dashboard/${remittance["ref"]}`}>
                      <a className="hover:text-blue-500">
                        {remittance[field.key]}
                      </a>
                    </Link>
                  </td>
                ))}
              </tr>
            ))} */}

            {posts.map((post, i) => (
              <tr key={post.id} className="">
                {fields.map((field, j) => (
                  <td key={j} className="">
                    <Link href={`/view/annual/${post.id}`}>
                      <a className="hover:text-blue-500">{post.title}</a>
                    </Link>
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
