import IconArrowBack from "components/icons/IconArrowBack";

function LinkBack(
  {
    text,
    onClick
  }
) {
  return (
    <div
      className="d-flex align-items-end cursor-pointer"
      onClick={onClick}
    >
      <IconArrowBack className="mr-1" />
      <div className="text-md">
        {text}
      </div>
    </div>
  );
}

export default LinkBack;
