import MainLayout from "layouts/Main";
import RadioField from "components/Form/RadioField";
import CheckboxField from "components/Form/CheckboxField";
import SwitcherField from "components/Form/SwitcherField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { defaultValues, schema } from "configs/settings/notifications";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSettings } from "store/settings/notifications";
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";
import Loader from "components/Loader";
import { genders } from "utils/constants";
import cn from "classnames";
import styles from "./index.module.scss";

NotificationsPage.layouts = [MainLayout];

function NotificationsPage() {
  const genderOptions = [
    { label: 'Women', option: genders.FEMALE },
    { label: 'Men', option: genders.MALE },
    { label: 'All', option: genders.ALL },
  ];

  const dispatch = useDispatch();
  const settings = useSelector(userSettings.selectors.settings);
  const settingsStatus = useSelector(userSettings.selectors.status);
  const saveSettingsStatus = useSelector(userSettings.selectors.saveSettingsStatus);
  const windowSize = useSelector(windowActions.selectors.windowSize);

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const isMobileSm = useMemo(() => {
    return windowSize.width <= mediaSizes.sm
  }, [windowSize])

  useEffect(() => {
    dispatch(userSettings.thunks.getUserSettings());
  }, []);

  useEffect(() => {
    if (settingsStatus === 'success') {
      const { genderType, configs } = settings;
      reset({ ...defaultValues, genderType, ...configs });
    }
  }, [settings]);

  const onSubmit = ({ genderType, ...data }) => {
    const formData = {
      genderType,
      configs: data,
    };

    dispatch(userSettings.thunks.saveUserSettings(formData));
  };

  if (['idle', 'pending'].includes(settingsStatus)) {
    return <Loader/>
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="title-sm text-semibold text-gilroy text-italic mb-5">
        Notification settings
      </div>
      <div className={styles.wrap}>
        <div className="d-flex align-items-start text-md text-semibold mb-4">
          <div className="mr-1">1.</div>
          <div>Please select who you want to receive notifications from</div>
        </div>
        <div className="d-flex flex-column align-items-start ml-3">
          <RadioField
            name="genderType"
            control={control}
            options={genderOptions}
            classes="mb-2"
          />
        </div>
      </div>
      <div className={styles.wrap}>
        <div className="d-flex align-items-start text-md text-semibold mb-4">
          <div className="mr-1">2.</div>
          <div>Choose a location where notifications will be sent, or turn them off</div>
        </div>
        {!isMobileSm ? (
          <div className={styles.table}>
            <div>
              <div className={styles.td}/>
              <div className={styles.td}>Website notifications</div>
              <div className={styles.td}>Email notifications</div>
            </div>
            <div>
              <div className={styles.td}>
                Messages
              </div>
              <div className={cn(
                styles.td,
                'justify-content-center'
              )}>
                <CheckboxField
                  name="message.website"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
              <div className={cn(
                styles.td,
                'justify-content-center'
              )}>
                <CheckboxField
                  name="message.email"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
            </div>
            <div>
              <div className={styles.td}>
                Shared albums
              </div>
              <div className={cn(
                styles.td,
                'justify-content-center'
              )}>
                <CheckboxField
                  name="sharedAlbum.website"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
              <div className={cn(
                styles.td,
                'justify-content-center'
              )}>
                <CheckboxField
                  name="sharedAlbum.email"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
            </div>
            <div>
              <div className={styles.td}>
                None
              </div>
              <div className={cn(
                styles.td,
                'justify-content-center'
              )}>
                <SwitcherField
                  name="global.website"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
              <div className={cn(
                styles.td,
                'justify-content-center'
              )}>
                <SwitcherField
                  name="global.email"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles["table-mobile"]}>
            <div className="mb-3">
              <div className="mb-2">Website notifications</div>
              <div className={styles['table-mobile__row']}>
                <div >Messages</div>
                <div className={styles['table-mobile__checkbox']}>
                  <CheckboxField
                    name="message.website"
                    control={control}
                    checkmarkColor="#5988b2"
                  />
                </div>
              </div>
              <div className={styles['table-mobile__row']}>
                <div>Shared albums</div>
                <div className={styles['table-mobile__checkbox']}>
                  <CheckboxField
                    name="sharedAlbum.website"
                    control={control}
                    checkmarkColor="#5988b2"
                  />
                </div>
              </div>
              <div className={styles['table-mobile__row']}>
                <div>None</div>
                <SwitcherField
                  name="global.website"
                  control={control}
                  checkmarkColor="#5988b2"
                  dark
                />
              </div>
            </div>
            <div>
              <div className="mb-2">Email notifications</div>
              <div className={styles['table-mobile__row']}>
                <div>Messages</div>
                <div className={styles['table-mobile__checkbox']}>
                  <CheckboxField
                    name="message.email"
                    control={control}
                    checkmarkColor="#5988b2"
                  />
                </div>
              </div>
              <div className={styles['table-mobile__row']}>
                <div>Shared albums</div>
                <div className={styles['table-mobile__checkbox']}>
                  <CheckboxField
                    name="sharedAlbum.email"
                    control={control}
                    checkmarkColor="#5988b2"
                  />
                </div>
              </div>
              <div className={styles['table-mobile__row']}>
                <div>None</div>
                <SwitcherField
                  name="global.email"
                  control={control}
                  checkmarkColor="#5988b2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.wrap}>
        <div className={styles.button}>
          <Button
            text="Save"
            type="submit"
            dark
            loader={saveSettingsStatus === 'pending'}
          />
        </div>
      </div>
    </form>
  );
}

export default NotificationsPage;
