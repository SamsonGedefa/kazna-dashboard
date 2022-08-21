import { VerifyEmail } from "../../page-components/VerifyEmail";
import Head from "next/head";
import jwt from "jsonwebtoken";

export default function EmailVerifyPage({ valid }) {
  return (
    <>
      <Head>
        <title>Email verification</title>
      </Head>
      <VerifyEmail valid={valid} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.params;

  const isValid = await new Promise((resolve) => {
    jwt.verify(
      token,
      process.env.NEXTAUTH_PROVIDER_EMAIL_VERIFICATION_SECRET,
      (err) => {
        if (err) resolve(false);
        if (!err) resolve(true);
      }
    );
  });

  if (!isValid) return { props: { valid: false } };

  const { id } = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  console.log(id);

  return { props: { valid: true } };
}
