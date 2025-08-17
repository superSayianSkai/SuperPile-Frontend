const Alert = ({
  children,
  width,
  height,
}) => {
  return (
    <div
      className={`${width} ${height}  bg-black rounded-lg text-white text-center flex justify-center items-center ${fontSize}`}
    >
      {children}
    </div>
  );
};

export default Alert;
