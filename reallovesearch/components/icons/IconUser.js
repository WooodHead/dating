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
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.33301 16.8412V12.3342C1.33301 11.2292 2.22801 10.3342 3.33301 10.3342H12.666C13.771 10.3342 14.666 11.2292 14.666 12.3342V16.8412M10.9634 4.12316C10.9634 5.75958 9.6368 7.08616 8.00038 7.08616C6.36396 7.08616 5.03738 5.75958 5.03738 4.12316C5.03738 2.48674 6.36396 1.16016 8.00038 1.16016C9.6368 1.16016 10.9634 2.48674 10.9634 4.12316Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>


    </div>
  );
}

export default IconUser;
