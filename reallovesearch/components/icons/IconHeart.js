import cn from "classnames";

function IconHeart(
  {
    color = '#ff95a1',
    size,
    className,
    solid = false,
    onClick = () => {
    },
  }
) {
  return (
    <div
      className={cn(
        'icon-default',
        { [`icon-default--${size}`]: size },
        className
      )}
      onClick={onClick}
    >
      {solid ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22.24L10.46 20.7C4.74 15.64 1 12.23 1 8.05C1 4.64 3.64 2 7.05 2C8.92 2 10.79 2.88 12 4.31C13.2078 2.88 15.08 2 16.95 2C20.36 2 23 4.64 23 8.05C23 12.23 19.26 15.64 13.54 20.7L12 22.24Z"
            fill={color} />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5181 22L5.17885 15.3333C3.71362 14.0326 2.68053 12.3154 2.21777 10.4116C2.0144 9.65388 1.95273 8.86513 2.03588 8.08503C2.37429 4.55711 4.91024 2 8.08071 2C8.9335 2.0005 9.77552 2.19052 10.5459 2.55631C11.3162 2.9221 11.9957 3.45452 12.535 4.11506C13.0964 3.45633 13.7932 2.92639 14.578 2.56139C15.3627 2.19639 16.2169 2.00491 17.0824 2C20.255 2 22.7931 4.55922 23.1188 8.08714C23.2013 8.86726 23.1396 9.65588 22.9369 10.4137C22.4759 12.3157 21.4459 14.0319 19.9843 15.3333L12.5181 22ZM8.07649 3.38748C5.63148 3.38748 3.67082 5.4264 3.42335 8.23731V8.28596C3.36215 8.89356 3.41305 9.50723 3.57352 10.0964C3.97141 11.7263 4.8568 13.196 6.11159 14.3096L12.5266 20.1388L19.0663 14.3054C20.3149 13.1909 21.195 11.7229 21.5896 10.0964C21.7526 9.50626 21.8064 8.89125 21.7482 8.28173V8.2352C21.4923 5.42428 19.5338 3.38536 17.0951 3.38536C16.2905 3.38546 15.5001 3.59666 14.8027 3.99787C14.1053 4.39909 13.5254 4.97626 13.1209 5.67174L12.5202 6.6764L11.9301 5.6654C11.5469 4.97921 10.9889 4.40664 10.3128 4.00582C9.63674 3.60501 8.86664 3.39021 8.08071 3.38325L8.07649 3.38748Z"
            fill={color} />
        </svg>
      )}
    </div>
  );
}

export default IconHeart;