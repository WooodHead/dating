import cn from "classnames";

function IconSend(
  {
    color = '#323B52',
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
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28">
          <rect width="28" height="28" fill="#ffffff"/>
        </mask>
        <g mask="url(#mask0)">
          <path d="M24.5707 12.2137L5.20688 4.17885C4.39112 3.84032 3.46951 3.98924 2.80177 4.5673C2.13404 5.14546 1.85475 6.03628 2.073 6.89207L3.79655 13.6511H12.2353C12.6236 13.6511 12.9385 13.9659 12.9385 14.3543C12.9385 14.7426 12.6236 15.0574 12.2353 15.0574H3.79655L2.073 21.8164C1.85475 22.6722 2.13399 23.563 2.80177 24.1412C3.47087 24.7204 4.39257 24.8675 5.20693 24.5296L24.5707 16.4948C25.4524 16.129 26 15.3088 26 14.3543C26 13.3997 25.4524 12.5795 24.5707 12.2137Z" fill={color}/>
        </g>
      </svg>
    </div>
  );
}

export default IconSend;
