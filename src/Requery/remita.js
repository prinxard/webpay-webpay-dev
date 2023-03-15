import axios from 'axios';
import sha512 from 'js-sha512';

const RequeryRemita = async (data) => {
  const CREDENTIALS = {
    MERCHANTID: '2547916',
    SERVICETYPEID: '4430731',
    APIKEY: '1946',
    CHECKSTATUSURL:
      'https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc',
  };
  const concatString = `${data}${CREDENTIALS.APIKEY}${CREDENTIALS.MERCHANTID}`;
  let hash = sha512(concatString);

  let result = null;

  try {
    const res = await axios.get(
      `${CREDENTIALS.CHECKSTATUSURL}/${CREDENTIALS.MERCHANTID}/${data}/${hash}/orderstatus.reg`,
      {
        headers: {
          Authorization: `remitaConsumerKey=${CREDENTIALS.MERCHANTID},remitaConsumerToken=${hash}`,
        },
      }
    );
    result = res.data;
  } catch (e) {
    if (e.request) {
      console.log('request');
    } else if (e.response) {
      console.log(e.response);
    }
  }

  return result;
};

export default RequeryRemita;
