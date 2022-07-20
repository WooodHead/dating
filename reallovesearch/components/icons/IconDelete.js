import cn from "classnames";

function IconDelete(
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
        <path d="M18.748 9.33297V18.332C18.748 19.989 17.405 21.332 15.748 21.332H8.415C6.758 21.332 5.415 19.989 5.415 18.332V9.33297M4.081 5.33497H20.081M10.748 2.66797H13.415M8.662 10.667V17.332M12.081 10.667V17.332M15.372 10.667V17.332" stroke="#031539" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default IconDelete;
