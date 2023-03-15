import Image from "next/image";
export const KgirsLogo = () => {
  return (
    <Image
      layout="fixed"
      src="/images/logo2.png"
      alt="login"
      width={45}
      height={45}
    />
  );
};
export const Home = () => {
  return (
    <Image
      layout="fixed"
      src="/images/home.png"
      alt="home icon"
      width={45}
      height={45}
    />
  );
};

export const LoginImage = () => {
  return (
    <Image
      layout="intrinsic"
      src="/images/login.png"
      alt="login"
      width={400}
      height={400}
    />
  );
};

export const SignUpImage = () => {
  return (
    <div className="">
      <Image
        layout="fixed"
        src="/images/Signup img.png"
        alt="signup"
        width={519}
        height={337}
      />
    </div>
  );
};

export const CompleteSignUpImage = () => {
  return (
    <Image
      layout="intrinsic"
      src="/images/complete.png"
      alt="complete signup"
      width={400}
      height={400}
    />
  );
};

export const SampleCsv = () => {
  return (
    <Image
      layout="intrinsic"
      src="/images/csv/csv.PNG"
      alt="sample csv"
      width={900}
      height={114}
    />
  );
};
export const SampleCsvMonthly = () => {
  return (
    <Image
      layout="intrinsic"
      src="/images/csv/monthly.PNG"
      alt="sample csv"
      width={1272}
      height={82}
    />
  );
};
export const SampleCsvWithholding = () => {
  return (
    <Image
      layout="intrinsic"
      src="/images/csv/wht.PNG"
      alt="sample csv"
      width={780}
      height={66}
    />
  );
};
export const WithholdingInterest = () => {
  return (
    <Image
      layout="intrinsic"
      src="/images/csv/wht_interest.PNG"
      alt="sample csv"
      width={1364}
      height={172}
    />
  );
};
