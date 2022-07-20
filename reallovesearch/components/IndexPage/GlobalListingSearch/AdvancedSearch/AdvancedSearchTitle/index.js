function AdvancedSearchTitle({ onClick = () => {}, children }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between text-md text-semibold text-poppins mb-2 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default AdvancedSearchTitle;
