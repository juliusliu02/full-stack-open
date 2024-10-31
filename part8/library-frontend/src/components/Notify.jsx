const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return <div>{errorMessage}</div>;
};

export default Notify;
