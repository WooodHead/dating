import cn from "classnames";

function IconCircleDelete(
  {
    bgColor = '#3D3C3B',
    color = '#FFFFFF',
    size,
    className
  }
) {
  return (
    <div
      className={cn(
        'icon-default',
        { [`icon-default--${size}`]: size },
        className
      )}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle opacity="0.7" cx="14" cy="14" r="14" fill={bgColor}/>
        <path d="M20 8L8 20" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8L20 20" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default IconCircleDelete;
