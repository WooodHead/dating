import cn from "classnames";

function IconUser(
  {
    color = '#5B676D',
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
        <path
          d="M17.4444 18.0007V16.4451C17.4444 14.7269 16.0516 13.334 14.3333 13.334H8.11111C6.39289 13.334 5 14.7269 5 16.4451V18.0007"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path
          d="M11.2224 10.2222C12.9407 10.2222 14.3336 8.82933 14.3336 7.11111C14.3336 5.39289 12.9407 4 11.2224 4C9.50422 4 8.11133 5.39289 8.11133 7.11111C8.11133 8.82933 9.50422 10.2222 11.2224 10.2222Z"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

    </div>
  );
}

export default IconUser;
