import cn from "classnames";

function IconEdit(
  {
    color = 'white',
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
        <path d="M9.711 5.25473L11.757 7.30073M2.734 19.9987H21.333M2.735 12.2307L12.163 2.80273L15.933 6.57273L6.505 16.0007H2.734L2.735 12.2307Z" stroke="#031539" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default IconEdit;
