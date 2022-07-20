import cn from "classnames";

function IconLoader(
  {
    className
  }
) {
  return (
    <div
      className={cn(
        'd-flex',
        className
      )}
    >
      <img
        src="/img/loader/loader.gif"
        alt=""/>
    </div>
  );
}

export default IconLoader;
