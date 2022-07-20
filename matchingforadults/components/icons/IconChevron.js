import cn from "classnames";

function IconChevronLeft(
  {
    color = '#847A87',
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 10L12 16L18 10" stroke={color} strokeLinecap="round"/>
      </svg>

    </div>
  );
}

export default IconChevronLeft;