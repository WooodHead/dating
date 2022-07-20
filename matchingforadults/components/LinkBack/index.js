import IconArrowBack from "components/icons/IconArrowBack";
// import styles from "./index.module.scss";

function LinkBack(
  {
    text,
    onClick
  }
) {
  return (
    <div
      className="d-flex align-items-center cursor-pointer"
      onClick={onClick}
    >
      <IconArrowBack
        size="sm"
        className="mr-1"
      />
      <div className="text-semibold">
        {text}
      </div>
    </div>
  );
}

export default LinkBack;
