import cn from "classnames";

function IconEdit(
  {
    color = '#4B5064',
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
          d="M9.71138 5.25376L11.7574 7.29976M2.73438 19.9978H21.3334M2.73537 12.2298L12.1634 2.80176L15.9334 6.57176L6.50538 15.9998H2.73438L2.73537 12.2298Z"
          stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default IconEdit;
