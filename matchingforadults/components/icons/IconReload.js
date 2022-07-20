import cn from "classnames";

function IconReload(
  {
    color = '#847A87',
    size,
    className
  }
) {
  return (
    <div className={className}>
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M46.6492 48.7497C39.0542 56.3447 26.7429 56.3447 19.1479 48.7497C11.5529 41.1547 11.5529 28.8435 19.1479 21.2485C26.7429 13.6535 39.0571 13.6535 46.6492 21.2485L56.5512 31.1505M56.5483 17.0951V31.1476H42.4958"
          stroke={color} strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default IconReload;
