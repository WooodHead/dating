import cn from "classnames";

function IconPhoto(
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
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.9172 2.31305L6.00442 0.506146C5.38684 0.418342 4.76111 0.598636 4.28494 1.00162C3.80882 1.3708 3.50362 1.91804 3.43975 2.51711L3.14834 4.90695H2.2448C0.962438 4.90695 0.00066554 6.04356 0.00066554 7.32592V19.2459C-0.0316334 20.4688 0.933486 21.4863 2.15638 21.5186C2.18584 21.5194 2.21535 21.5196 2.2448 21.5192H18.245C19.5274 21.5192 20.6931 20.5283 20.6931 19.2459V18.7796C21.0907 18.7028 21.4679 18.544 21.8006 18.3133C22.2728 17.9158 22.5752 17.3527 22.6458 16.7395L23.9865 4.90695C24.1231 3.62163 23.2007 2.4654 21.9172 2.31305ZM19.5274 19.2459C19.5274 19.8871 18.8862 20.3534 18.245 20.3534H2.2448C1.6656 20.3704 1.18228 19.9147 1.16527 19.3355C1.16438 19.3056 1.16477 19.2758 1.16644 19.2459V17.0893L5.68383 13.7668C6.2265 13.3502 6.99085 13.3872 7.49079 13.8542L10.6675 16.6521C11.1499 17.0571 11.7572 17.2836 12.3871 17.2933C12.8795 17.2993 13.3639 17.1681 13.786 16.9144L19.5274 13.5919V19.2459H19.5274ZM19.5274 12.2221L13.1739 15.9235C12.6283 16.2467 11.9378 16.1882 11.4544 15.7778L8.2485 12.9507C7.32968 12.1612 5.98674 12.1128 5.01347 12.8342L1.16644 15.632V7.32592C1.16644 6.68474 1.60362 6.07273 2.2448 6.07273H18.245C18.93 6.10113 19.4832 6.64178 19.5274 7.32592V12.2221ZM22.8218 4.74959C22.8214 4.75344 22.8211 4.75734 22.8206 4.76119L21.4509 16.5938C21.4532 16.9006 21.3133 17.1912 21.072 17.3807C20.9554 17.4973 20.6931 17.5556 20.6931 17.6139V7.32592C20.6471 5.9982 19.5731 4.93702 18.2449 4.90695H4.31405L4.57635 2.6337C4.63325 2.33932 4.78716 2.07256 5.01353 1.87593C5.26913 1.6992 5.57818 1.61681 5.88789 1.64275L21.7716 3.47883C22.4124 3.53969 22.8827 4.10863 22.8218 4.74959Z" fill={color}/>
      </svg>

    </div>
  );
}

export default IconPhoto;