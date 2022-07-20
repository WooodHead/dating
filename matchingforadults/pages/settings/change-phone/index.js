import TextField from "components/Form/TextField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/account/change-phone";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "layouts/Main";
import { userEditProfile } from "store/user/edit-profile";
import { userProfile } from "store/user/profile";
import { useEffect, useState } from "react";
import PopupNotification from "components/Popups/PopupNotification";
import styles from "../change-email/index.module.scss";

ChangePhonePage.layouts = [MainLayout];

function ChangePhonePage() {
    const dispatch = useDispatch();
    const changePhoneStatus = useSelector(userEditProfile.selectors.changePhoneStatus);
    const { phone } = useSelector(userProfile.selectors.profile);

    const { control, handleSubmit, reset } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        await dispatch(userEditProfile.thunks.changePhone(data));
        await dispatch(userProfile.thunks.getUserProfile());
    };

    useEffect(() => {
        if (changePhoneStatus === 'success') {
            reset();
            dispatch(userEditProfile.actions.RESET_STATUS('changePhoneStatus'));
        }
    }, [changePhoneStatus]);

    return (
        <>
            <div className="d-flex align-items-end mb-3">
                <div className="text-md text-bold mr-4">Phone:</div>
                <div>{phone || `No phone added`}</div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    id="phone"
                    label="New phone"
                    name="phone"
                    type="text"
                    placeholder="Enter your new phone"
                    control={control}
                />
                <div className={styles.button}>
                    <Button
                        type="submit"
                        dark
                        textSize="md"
                        loader={changePhoneStatus === 'pending'}
                    >
                      Submit
                    </Button>
                </div>
            </form>
        </>
    );
}

export default ChangePhonePage;