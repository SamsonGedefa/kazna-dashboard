export const VerifyEmail = ({ valid }) => {
  return (
    <>
      {valid ? (
        <h1>
          Congradulation, Your email is verified. You may close this page now.
        </h1>
      ) : (
        <h1>
          Opps... YOu may have clicked the wrong link, please close this page
          and try again.
        </h1>
      )}
    </>
  );
};
