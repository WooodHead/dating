import { useEffect, useRef, useState } from "react";
import IconUser from "@/img/settings-list/icon-user.svg";
import IconMessage from "@/img/settings-list/icon-message.svg";
import IconShieldCheck from "@/img/settings-list/icon-shield-check.svg";
import IconSettings from "@/img/settings-list/icon-settings.svg";
import IconLogout from "@/img/settings-list/icon-logout.svg";
import OutsideAlerter from "hooks/ClickOutside";
import Router, { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";
import cn from "classnames";
import styles from './index.module.scss';
import IconMobileMenu from "components/icons/IconMobileMenu";
import { bodyOverflow, cancelOverflow } from "utils/helpers";

function SettingsList({ userProfile }) {
  const dispatch = useDispatch();
  const mobileMenu = useRef(null);
  const router = useRouter();

  const dropdownList = [
    { name: 'My account', onClick: () => Router.push('/account/profile/personal') },
    { name: 'Shared private albums', onClick: () => Router.push('/shared-private-albums') },
    { name: 'Notification', onClick: () => Router.push('/settings/notifications') },
    { name: 'Messages', onClick: () => Router.push('/chat') },
    { name: 'Sign out', onClick: () => dispatch(auth.thunks.logout()) },
  ];

  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setDropdownIsVisible(false);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  const toggleMenu = () => {
    setDropdownIsVisible(!dropdownIsVisible)
    bodyOverflow(992);
  }

  const Dropdown = () => {

    useEffect(() => {
      return () => {
        cancelOverflow();
      }
    }, [])

    return (
      <OutsideAlerter
        extraRefs={[mobileMenu]}
        isOpen={dropdownIsVisible}
        close={() => setDropdownIsVisible(false)}
      >
        <div className={styles.dropdown}>
          {dropdownList.map(item => (
            <div
              key={item.name}
              className={styles['dropdown__item']}
              onClick={item.onClick}
            >
              <div className="mr-1">
                {item.icon && (
                  <img
                    src={item.icon.src}
                    alt=""
                    className="icon-default icon-default--xs"
                  />
                )}
              </div>
              <div className="text-md text-gilroy">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </OutsideAlerter>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={cn(
        styles.burger,
        'cursor-pointer'
      )}
      ref={mobileMenu}
      onClick={toggleMenu}
      >
        <IconMobileMenu isOpen={dropdownIsVisible}/>
      </div>
      {dropdownIsVisible && (
        <Dropdown />
      )}
    </div>
  );
}

export default SettingsList;
