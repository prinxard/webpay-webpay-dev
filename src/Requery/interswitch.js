import axios from 'axios';
import sha512 from 'js-sha512';

const RequeryWebPay = async (amount, ref) => {
  const CREDENTIALS = {
    MAC: 'D3D1D05AFE42AD50818167EAC73C109168A0F108F32645C8B59E897FA930DA44F9230910DAC9E20641823799A107A02068F7BC0F4CC41D2952E249552255710F',
    PRODUCT_ID: '1076',
    ITEM_ID: '101',
    URL: 'https://sandbox.interswitchng.com/collections/api/v1/gettransaction.json',
    Host: 'https://sandbox.interswitchng.com',
  };

  amount = amount * 1 * 100;
  const concatString = `${CREDENTIALS.PRODUCT_ID}${ref}${CREDENTIALS.MAC}`;
  let hash = sha512(concatString);

  let result = null;

  try {
    const res = await axios.get(
      `${CREDENTIALS.URL}?productid=${CREDENTIALS.PRODUCT_ID}&transactionreference=${ref}&amount=${amount}`,
      {
        headers: {
          Hash: hash,
          Host: CREDENTIALS.Host,
        },
      }
    );
    result = res.data;
  } catch (e) {}
  console.log(result);
  return result;
};

export default RequeryWebPay;
