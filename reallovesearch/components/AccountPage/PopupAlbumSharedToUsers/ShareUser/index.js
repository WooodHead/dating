import { memo, useEffect, useState } from "react";
import Avatar from "components/Avatar";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import Loader from "components/Loader";
import cn from "classnames";
import styles from "./index.module.scss";

function ShareUser(
  {
    user,
    isPending,
    onDelete,
  }
) {
    const [loader, setLoader] = useState(false);

    const handleDeleteUser = () => {
        onDelete(user._id);
        setLoader(true);
    };

    useEffect(() => {
        if (loader) !isPending && setLoader(false);
    }, [isPending]);

    return (
        <div className={styles.personWrapper}>
            <div className="d-flex align-items-center">
                <Avatar
                    size="xs"
                    thumb={user.path}
                    name={user.label}
                />
                <div className="text-semibold text-md ml-2">
                    {user.label}
                </div>
            </div>
            {!loader ? (
                <IconButton
                    className="ml-1 h-100"
                    disabled={isPending}
                    onClick={handleDeleteUser}
                >
                    <IconClose
                        color="white"
                        size="sm"
                    />
                </IconButton>
            ) : (
                <div className={cn(
                    styles['btn--loader']
                )}
                >
                    <Loader size="sm"/>
                </div>
            )}
        </div>
  );
}

export default memo(ShareUser);
