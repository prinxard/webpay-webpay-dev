import axios from 'axios';

const RequeryEtransact = async (data) => {
  let result = null;
  //test credentials
  const credentials = {
    terminal_id: '0000000001',
    secret_key: 'DEMO_KEY',
    base_url: 'https://demo.etranzact.com',
  };

  //live credentials
  // jF7Y6ouoYRcZ51Ol;
  // const credentials = {
  //   terminal_id: '7007139806',
  //   secret_key: 'jF7Y6ouoYRcZ51Ol',
  //   base_url: ' https://www.etranzact.net/ ',
  // };

  const TERMINAL_ID = credentials.terminal_id;
  const SECRET_KEY = credentials.secret_key;
  const TRANSACTION_ID = data;

  const Data = {
    transaction_id: TRANSACTION_ID,
  };

  try {
    const res = await axios.post(
      `${credentials.base_url}/CardProcessor/webconnect/api/v1/re-query`,
      Data,
      {
        headers: {
          'API-Key':
            'umWpFCOyVktReQ43Hg56TPiYaqT762qoCNsCQaICJkgXZkPeyz2EEMyLnpTfaNLYjF01UIUTReq45Re46',
          'Terminal-Id': TERMINAL_ID,
          'Secret-Key': SECRET_KEY,
        },
      }
    );
    result = res.data;
  } catch (e) {}

  return result;
};

export default RequeryEtransact;
