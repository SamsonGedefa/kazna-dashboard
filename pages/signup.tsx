import SignUp from "../page-components/SignUp";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

const SignupPage = () => {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <SignUp />
    </>
  );
};

export default SignupPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
}
