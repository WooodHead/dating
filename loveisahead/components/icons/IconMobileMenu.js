import cn from "classnames";

function IconMobileMenu(
  {
    color = '#ffffff',
    className,
    isOpen = false
  }
) {
  return (
    <div className={cn(
      className
    )}>
      {!isOpen ? (
        <svg width="18" height="12" viewBox="0 0 18 12" fill={color} xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill={color} />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="white"/>
        </svg>
        )}
    </div>
  );
}

export default IconMobileMenu;
