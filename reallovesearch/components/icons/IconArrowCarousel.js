import cn from "classnames";

function IconArrowCarousel(
  {
    color = '#828282',
    hoverColor = '#323B52',
    size,
    className,
    onClick
  }
) {
  return (
    <div
      style={{ '--hover-color': hoverColor}}
      className={cn(
        'icon-carousel cursor-pointer',
        { [`icon-carousel--${size}`]: size },
        className
      )}
      onClick={onClick}
    >
      <svg width="32" height="18" viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.65487 0C10.1041 0 10.5624 0.176472 10.9049 0.52237C11.5947 1.21902 11.5962 2.36109 10.9264 3.07981L10.9156 3.09069H10.9049L6.83159 7.20435H29.2562C30.246 7.20435 31.0342 8.03291 31.0342 9C31.0342 9.99966 30.2138 10.7956 29.2562 10.7956H6.83159L10.9049 14.9093C11.5947 15.606 11.5962 16.748 10.9264 17.4667L10.9156 17.4776H10.9049C10.5538 17.8322 10.0967 18 9.65487 18C9.19759 18 8.74414 17.8203 8.40487 17.4776L0.419958 9.41354L-0.000301361 9L0.419958 8.58646L8.40487 0.52237C8.75274 0.171117 9.20563 0 9.65487 0ZM9.65487 1.17533C9.49234 1.17533 9.34214 1.22998 9.22384 1.34946L1.64841 9L9.22384 16.6505C9.35068 16.7786 9.47125 16.8247 9.65487 16.8247C9.78949 16.8247 9.94992 16.7678 10.0644 16.6614C10.3268 16.3798 10.3283 15.9812 10.0859 15.7364L5.02125 10.6215L4.02987 9.62031H5.43073H29.2562C29.5803 9.62031 29.8704 9.35369 29.8704 9C29.8704 8.67258 29.6064 8.37969 29.2562 8.37969H5.43073H4.02987L5.02125 7.37848L10.0644 2.27449C10.3268 1.9929 10.3283 1.59427 10.0859 1.34946C9.9623 1.22459 9.8174 1.17533 9.65487 1.17533Z"
          fill={color}/>
      </svg>

    </div>
  );
}

export default IconArrowCarousel;
