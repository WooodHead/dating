import IconPersonalInfo from "@/img/settings-list/icon-personal-info.svg";
import IconPhotos from "@/img/settings-list/icon-photos.svg";
import IconShared from "@/img/settings-list/icon-shared.svg";
import IconSubscription from '@/img/settings-list/icon-subscription.svg'
import IconChat from "@/img/settings-list/icon-chat.svg";
import IconSupport from "@/img/settings-list/icon-support.svg";
import IconSettings from "@/img/settings-list/icon-settings.svg";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import Avatar from "components/Avatar";
import Link from "next/link";
import { useEffect } from "react";
import { windowActions } from "store/windowActions";
import cn from "classnames";
import styles from './index.module.scss';

function SettingsList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, smAvatarPath } = useSelector(userProfile.selectors.profile);
  
  const routeActive = (basePath) => router.pathname.includes(basePath);
  
  const dropdownList = [
    {
      icon: IconPersonalInfo,
      name: 'Personal info',
      basePath: 'profile/personal',
      onClick: () => router.push('/account/profile/personal'),
      children: null
    },
    {
      icon: IconPhotos, name: 'Photos', basePath: 'photos', onClick: () => router.push('/account/photos/main-photos'), children: [
        { name: 'Main photos', basePath: 'photos/main-photos', onClick: () => router.push('/account/photos/main-photos') },
        { name: 'Public albums', basePath: 'photos/public-albums', onClick: () => router.push('/account/photos/public-albums') },
        { name: 'Private albums', basePath: 'photos/private-albums', onClick: () => router.push('/account/photos/private-albums') },
      ]
    },
    {
      icon: IconShared,
      name: 'Shared albums',
      basePath: 'shared/private-albums',
      onClick: () => router.push('/account/shared/private-albums'),
      children: null
    },
    {
      icon: IconSubscription,
      name: 'Subscription',
      basePath: 'account/subscription',
      onClick: () => router.push('/account/subscription'),
      children: null
    },
    { icon: IconChat, name: 'Chat', basePath: 'chat', onClick: () => router.push('/chat'), children: null },
    { icon: IconSupport, name: 'Support', onClick: () => router.push('/support'), children: null },
    {
      icon: IconSettings, name: 'Settings', basePath: 'settings', onClick: () => router.push('/settings/change-email'), children: [
        { name: 'Change email', basePath: 'settings/change-email', onClick: () => router.push('/settings/change-email') },
        { name: 'Change phone', basePath: 'settings/change-phone', onClick: () => router.push('/settings/change-phone') },
        { name: 'Change password', basePath: 'settings/change-password', onClick: () => router.push('/settings/change-password') },
        { name: 'Notification', basePath: 'settings/notifications', onClick: () => router.push('/settings/notifications') },
      ]
    },
  ];
  
  useEffect(() => {
    const handleRouteChange = () => dispatch(windowActions.actions.TOGGLE_ASIDE(false));
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);
  
  return (
    <>
      <div className="d-flex align-items-center mt-5 mb-3">
        <Avatar
          name={name}
          isOnline={true}
          size="md"
          thumb={smAvatarPath}
          onlinePosition="top-right"
          className="mr-2"
        />
        <div>
          <Link href="/account/profile/personal">
            <a className="d-flex align-items-center text-md text-italic mb-1 color-grey-700">
              Edit profile
              <img src="/img/settings-list/icon-edit.svg" alt="" className="icon-default ml-1" />
            </a>
          </Link>
          <div className="text-lg text-semibold text-overflow">{name}</div>
        </div>
      </div>
      <div className={styles.dropdown}>
        {dropdownList.map(item => (
          <div key={item.name}>
            <div
              className={cn(styles['dropdown__item'], 'text-medium')}
              onClick={item.onClick}
            >
              <div className="mr-1">
                <img
                  src={item.icon.src}
                  alt=""
                  className="icon-default"
                />
              </div>
              <div className={cn(
                { [styles['dropdown__item-text--active']]: routeActive(item.basePath) }
              )}>
                {item.name}
              </div>
            </div>
            {item.children && item.children.map(child => (
              <div
                key={child.name}
                className={cn(
                  styles['dropdown__item-child'],
                  { [styles['dropdown__item-child--active']]: routeActive(child.basePath) },
                  'text-md'
                )}
                onClick={child.onClick}
              >
                {child.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default SettingsList;
