import cn from "classnames";

function IconUnlock(
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
        <path fillRule="evenodd" clipRule="evenodd"
              d="M4.79883 13.1992C4.79883 12.0946 5.69426 11.1992 6.79883 11.1992H17.1999C18.3045 11.1992 19.1999 12.0946 19.1999 13.1992V17.9999C19.1999 19.1044 18.3045 19.9999 17.1999 19.9999H6.79883C5.69426 19.9999 4.79883 19.1044 4.79883 17.9999V13.1992Z"
              stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path
          d="M8 11.1989V7.99868C7.99794 5.94352 9.55351 4.22116 11.5983 4.01462C13.643 3.80808 15.5116 5.18456 15.9206 7.19862"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default IconUnlock;
