import cn from "classnames";

function IconTick(
    {
        color = '#FFFFFF',
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
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.00039 11.2016L1.80039 7.00156L0.400391 8.40156L6.00039 14.0016L18.0004 2.00156L16.6004 0.601562L6.00039 11.2016Z" fill={color} />
            </svg>
        </div>
    );
}

export default IconTick;