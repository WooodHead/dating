import cn from "classnames";

function IconCheck(
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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3337 4.6665L6.00033 11.9998L2.66699 8.6665" stroke={color} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default IconCheck;