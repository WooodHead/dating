import cn from "classnames";

function IconArrowBack(
  {
    color = '#0D5DA7',
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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3337 8H2.66699" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.66699 12L2.66699 8L6.66699 4" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default IconArrowBack;
