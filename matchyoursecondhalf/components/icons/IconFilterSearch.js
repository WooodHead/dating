import cn from "classnames";

function IconFilterSearch(
  {
    color = '#FFFFFF',
    size,
    className
  }
) {
  return (
    <div className={cn(
      'icon-default',
      { [`icon-default--${size}`]: size },
      className
    )}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3333 24H18.6667V21.3333H13.3333V24ZM4 8V10.6667H28V8H4ZM8 17.3333H24V14.6667H8V17.3333Z" />
      </svg>
    </div>
  );
}

export default IconFilterSearch;