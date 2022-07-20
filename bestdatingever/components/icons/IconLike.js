import cn from "classnames";

function IconLike(
  {
    color = '#347B91',
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
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.1107 8.25606C16.3646 8.4407 16.6176 6.0854 16.714 4.92857C16.8569 3.2058 17.3792 1.41488 15.6836 1.07577L15.5237 1.04401C14.6765 0.875023 13.8077 1.20052 13.2815 1.88555L8.04059 8.69838C7.88748 8.89686 7.80469 9.13957 7.80469 9.39021V19.5976C7.80469 20.0614 8.08709 20.4777 8.51807 20.65L13.3779 22.594C14.047 22.8616 14.7616 23 15.484 23C16.6114 23 18.6063 23 20.0887 23C21.7332 23 23.1418 21.8239 23.4367 20.2055L24.8793 12.2664C25.0608 11.274 24.7908 10.2533 24.1444 9.47868C23.4979 8.70405 22.5407 8.25606 21.5324 8.25606C21.5324 8.25606 19.8568 8.07143 18.1107 8.25606Z"
            fill={color} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.3104 8.25598H3.2683C2.0162 8.25598 1 9.27104 1 10.5243V20.7316C1 21.9837 2.0162 22.9999 3.2683 22.9999C4.5272 22.9999 6.54599 22.9999 7.80489 22.9999C8.57612 22.9999 9.25774 22.6143 9.66717 22.0257L8.20185 21.4405C7.44877 21.1388 6.95428 20.4084 6.95428 19.5975V9.39013C6.95428 8.98411 7.07904 8.58829 7.3104 8.25598Z"
            fill={color} />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.2227 9.93137C22.739 10.5499 22.9543 11.3663 22.8097 12.1588L21.427 19.7682C21.1921 21.0607 20.066 21.9999 18.7528 21.9999H14.3393C13.7164 21.9999 13.1001 21.8814 12.5217 21.6499L8.60943 20.0846V20.3694C8.60943 21.2695 7.88001 22 6.97884 22H2.63059C1.73051 22 1 21.2695 1 20.3694V10.5859C1 9.68468 1.73051 8.95526 2.63059 8.95526H6.97884C7.22905 8.95526 7.46603 9.01149 7.67782 9.11202L12.6587 2.63718C13.037 2.14475 13.6621 1.90994 14.2708 2.03169L14.4241 2.06322C15.7786 2.33389 16.7145 3.57749 16.5993 4.95371L16.3156 8.366C16.3025 8.51819 16.3536 8.66711 16.4569 8.77908C16.5602 8.89105 16.7048 8.95518 16.8569 8.95518H20.1366C20.9421 8.95518 21.7063 9.31283 22.2227 9.93137ZM8.60941 10.5788V9.68352L13.5197 3.2992C13.6469 3.13615 13.8545 3.05788 14.0578 3.0981L14.211 3.12854C15.0242 3.29159 15.5851 4.03732 15.5166 4.86349L15.2318 8.27577C15.1937 8.73016 15.3481 9.18021 15.6568 9.51502C15.9656 9.85092 16.4015 10.0422 16.8569 10.0422H20.1366C20.6204 10.0422 21.078 10.2564 21.3878 10.6282C21.6976 10.9989 21.827 11.488 21.7411 11.9642L20.3573 19.5736C20.216 20.3487 19.5409 20.9129 18.7528 20.9129H14.3393C13.8545 20.9129 13.3751 20.8205 12.9261 20.64L8.60943 18.9138V10.5859C8.60943 10.5835 8.60942 10.5812 8.60941 10.5788ZM7.52237 19.2863C7.52236 19.285 7.52235 19.2836 7.52235 19.2823V10.5817C7.52014 10.2836 7.27749 10.0423 6.97884 10.0423H2.63059C2.33056 10.0423 2.08706 10.2858 2.08706 10.5859V20.3694C2.08706 20.6694 2.33056 20.9129 2.63059 20.9129H6.97884C7.27887 20.9129 7.52237 20.6694 7.52237 20.3694V19.2863Z"
            fill={color} />
          <path
            d="M22.8097 12.1588L22.7113 12.1408L22.7113 12.1409L22.8097 12.1588ZM22.2227 9.93137L22.1459 9.99545V9.99545L22.2227 9.93137ZM21.427 19.7682L21.3286 19.7503L21.3286 19.7503L21.427 19.7682ZM12.5217 21.6499L12.5589 21.557L12.5589 21.557L12.5217 21.6499ZM8.60943 20.0846L8.64657 19.9917L8.50943 19.9369V20.0846H8.60943ZM7.67782 9.11202L7.63494 9.20236L7.70787 9.23698L7.75708 9.173L7.67782 9.11202ZM12.6587 2.63718L12.738 2.69816L12.738 2.6981L12.6587 2.63718ZM14.2708 2.03169L14.291 1.93374L14.2904 1.93363L14.2708 2.03169ZM14.4241 2.06322L14.404 2.16117L14.4045 2.16128L14.4241 2.06322ZM16.5993 4.95371L16.4997 4.94537L16.4997 4.94543L16.5993 4.95371ZM16.3156 8.366L16.4152 8.37454L16.4152 8.37428L16.3156 8.366ZM16.4569 8.77908L16.3834 8.84688V8.84688L16.4569 8.77908ZM8.60941 10.5788H8.50941L8.50941 10.5793L8.60941 10.5788ZM8.60941 9.68352L8.53015 9.62255L8.50941 9.64951V9.68352H8.60941ZM13.5197 3.2992L13.4408 3.2377L13.4404 3.23824L13.5197 3.2992ZM14.0578 3.0981L14.0772 3.00001L14.0772 3L14.0578 3.0981ZM14.211 3.12854L14.2307 3.03049L14.2305 3.03045L14.211 3.12854ZM15.5166 4.86349L15.6163 4.8718L15.6163 4.87175L15.5166 4.86349ZM15.2318 8.27577L15.3314 8.28412L15.3314 8.28409L15.2318 8.27577ZM15.6568 9.51502L15.7305 9.44735L15.7303 9.44723L15.6568 9.51502ZM21.3878 10.6282L21.311 10.6922L21.3111 10.6923L21.3878 10.6282ZM21.7411 11.9642L21.8395 11.9821L21.8395 11.9819L21.7411 11.9642ZM20.3573 19.5736L20.4557 19.5915L20.4557 19.5915L20.3573 19.5736ZM12.9261 20.64L12.9634 20.5472L12.9633 20.5472L12.9261 20.64ZM8.60943 18.9138H8.50943V18.9815L8.5723 19.0066L8.60943 18.9138ZM7.52237 19.2863H7.62237L7.62236 19.2856L7.52237 19.2863ZM7.52235 10.5817H7.62235L7.62235 10.581L7.52235 10.5817ZM22.9081 12.1767C23.058 11.355 22.8348 10.5086 22.2994 9.86728L22.1459 9.99545C22.6433 10.5912 22.8506 11.3776 22.7113 12.1408L22.9081 12.1767ZM21.5253 19.7861L22.9081 12.1766L22.7113 12.1409L21.3286 19.7503L21.5253 19.7861ZM18.7528 22.0999C20.1143 22.0999 21.2819 21.1262 21.5253 19.7861L21.3286 19.7503C21.1024 20.9952 20.0176 21.8999 18.7528 21.8999V22.0999ZM14.3393 22.0999H18.7528V21.8999H14.3393V22.0999ZM12.4846 21.7427C13.0747 21.979 13.7037 22.0999 14.3393 22.0999V21.8999C13.7291 21.8999 13.1254 21.7838 12.5589 21.557L12.4846 21.7427ZM8.57228 20.1774L12.4846 21.7427L12.5589 21.557L8.64657 19.9917L8.57228 20.1774ZM8.70943 20.3694V20.0846H8.50943V20.3694H8.70943ZM6.97884 22.1C7.93528 22.1 8.70943 21.3247 8.70943 20.3694H8.50943C8.50943 21.2143 7.82474 21.9 6.97884 21.9V22.1ZM2.63059 22.1H6.97884V21.9H2.63059V22.1ZM0.9 20.3694C0.9 21.3247 1.67528 22.1 2.63059 22.1V21.9C1.78573 21.9 1.1 21.2143 1.1 20.3694H0.9ZM0.9 10.5859V20.3694H1.1V10.5859H0.9ZM2.63059 8.85526C1.67532 8.85526 0.9 9.62941 0.9 10.5859H1.1C1.1 9.73995 1.78569 9.05526 2.63059 9.05526V8.85526ZM6.97884 8.85526H2.63059V9.05526H6.97884V8.85526ZM7.7207 9.02168C7.49578 8.91492 7.24418 8.85526 6.97884 8.85526V9.05526C7.21392 9.05526 7.43628 9.10807 7.63494 9.20236L7.7207 9.02168ZM12.5795 2.57621L7.59856 9.05105L7.75708 9.173L12.738 2.69816L12.5795 2.57621ZM14.2904 1.93363C13.6443 1.80441 12.9809 2.05363 12.5794 2.57626L12.738 2.6981C13.0931 2.23586 13.6798 2.01547 14.2512 2.12975L14.2904 1.93363ZM14.4442 1.96527L14.291 1.93374L14.2507 2.12964L14.404 2.16117L14.4442 1.96527ZM16.699 4.96206C16.8184 3.53515 15.848 2.24579 14.4437 1.96515L14.4045 2.16128C15.7092 2.422 16.6106 3.61983 16.4997 4.94537L16.699 4.96206ZM16.4152 8.37428L16.699 4.962L16.4997 4.94543L16.2159 8.35771L16.4152 8.37428ZM16.5304 8.71128C16.4462 8.61995 16.4046 8.49873 16.4152 8.37454L16.216 8.35746C16.2005 8.53764 16.2611 8.71427 16.3834 8.84688L16.5304 8.71128ZM16.8569 8.85518C16.7331 8.85518 16.615 8.803 16.5304 8.71128L16.3834 8.84688C16.5054 8.9791 16.6765 9.05518 16.8569 9.05518V8.85518ZM20.1366 8.85518H16.8569V9.05518H20.1366V8.85518ZM22.2994 9.86728C21.7641 9.22599 20.9718 8.85518 20.1366 8.85518V9.05518C20.9125 9.05518 21.6486 9.39966 22.1459 9.99545L22.2994 9.86728ZM8.70941 10.5788V9.68352H8.50941V10.5788H8.70941ZM8.68868 9.74448L13.5989 3.36017L13.4404 3.23824L8.53015 9.62255L8.68868 9.74448ZM13.5985 3.36071C13.7027 3.22718 13.8724 3.16336 14.0384 3.1962L14.0772 3C13.8366 2.95239 13.591 3.04511 13.4408 3.2377L13.5985 3.36071ZM14.0383 3.19618L14.1916 3.22662L14.2305 3.03045L14.0772 3.00001L14.0383 3.19618ZM14.1914 3.22658C14.9547 3.37966 15.4812 4.07966 15.4169 4.85522L15.6163 4.87175C15.6889 3.99498 15.0936 3.20353 14.2307 3.03049L14.1914 3.22658ZM15.4169 4.85517L15.1321 8.26745L15.3314 8.28409L15.6163 4.8718L15.4169 4.85517ZM15.1321 8.26743C15.0918 8.7497 15.2556 9.22737 15.5833 9.58281L15.7303 9.44723C15.4406 9.13304 15.2957 8.71063 15.3314 8.28412L15.1321 8.26743ZM15.5832 9.58269C15.9109 9.93919 16.3735 10.1422 16.8569 10.1422V9.94225C16.4295 9.94225 16.0203 9.76266 15.7305 9.44735L15.5832 9.58269ZM16.8569 10.1422H20.1366V9.94225H16.8569V10.1422ZM20.1366 10.1422C20.5907 10.1422 21.0202 10.3432 21.311 10.6922L21.4646 10.5642C21.1358 10.1696 20.65 9.94225 20.1366 9.94225V10.1422ZM21.3111 10.6923C21.6019 11.0402 21.7233 11.4994 21.6427 11.9464L21.8395 11.9819C21.9307 11.4767 21.7934 10.9575 21.4645 10.564L21.3111 10.6923ZM21.6427 11.9463L20.2589 19.5557L20.4557 19.5915L21.8395 11.9821L21.6427 11.9463ZM20.2589 19.5557C20.1262 20.2833 19.4925 20.8129 18.7528 20.8129V21.0129C19.5893 21.0129 20.3057 20.414 20.4557 19.5915L20.2589 19.5557ZM18.7528 20.8129H14.3393V21.0129H18.7528V20.8129ZM14.3393 20.8129C13.8672 20.8129 13.4005 20.7229 12.9634 20.5472L12.8888 20.7328C13.3497 20.918 13.8418 21.0129 14.3393 21.0129V20.8129ZM12.9633 20.5472L8.64656 18.8209L8.5723 19.0066L12.889 20.7329L12.9633 20.5472ZM8.70943 18.9138V10.5859H8.50943V18.9138H8.70943ZM8.70943 10.5859C8.70943 10.5834 8.70942 10.5809 8.70941 10.5784L8.50941 10.5793C8.50942 10.5814 8.50943 10.5836 8.50943 10.5859H8.70943ZM7.42235 19.2823C7.42235 19.2839 7.42236 19.2855 7.42237 19.2871L7.62236 19.2856C7.62236 19.2845 7.62235 19.2834 7.62235 19.2823H7.42235ZM7.42235 10.5817V19.2823H7.62235V10.5817H7.42235ZM6.97884 10.1423C7.22251 10.1423 7.42055 10.3392 7.42236 10.5825L7.62235 10.581C7.61973 10.228 7.33247 9.94232 6.97884 9.94232V10.1423ZM2.63059 10.1423H6.97884V9.94232H2.63059V10.1423ZM2.18706 10.5859C2.18706 10.3411 2.38579 10.1423 2.63059 10.1423V9.94232C2.27533 9.94232 1.98706 10.2306 1.98706 10.5859H2.18706ZM2.18706 20.3694V10.5859H1.98706V20.3694H2.18706ZM2.63059 20.8129C2.38579 20.8129 2.18706 20.6142 2.18706 20.3694H1.98706C1.98706 20.7247 2.27533 21.0129 2.63059 21.0129V20.8129ZM6.97884 20.8129H2.63059V21.0129H6.97884V20.8129ZM7.42237 20.3694C7.42237 20.6142 7.22364 20.8129 6.97884 20.8129V21.0129C7.33409 21.0129 7.62237 20.7247 7.62237 20.3694H7.42237ZM7.42237 19.2863V20.3694H7.62237V19.2863H7.42237Z"
            fill={color} mask="url(#path-2-outside-1_3454_37472)" />
        </svg>
      )}
    </div>
  );
}

export default IconLike;