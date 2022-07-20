import {useState, useEffect, useRef} from "react";
import IconChevronRight from "components/icons/IconChevronRight";
import IconMobileMenu from "components/icons/IconMobileMenu";
import IconUser from "@/img/settings-list/icon-user.svg";
import IconMessage from "@/img/settings-list/icon-message.svg";
import IconShieldCheck from "@/img/settings-list/icon-shield-check.svg";
import IconSettings from "@/img/settings-list/icon-settings.svg";
import IconLogout from "@/img/settings-list/icon-logout.svg";
import OutsideAlerter from "hooks/ClickOutside";
import Router, { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";
import { bodyOverflow, cancelOverflow } from 'utils/helpers';
import cn from "classnames";
import styles from './index.module.scss';

function SettingsList({ userProfile }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const mobileMenu = useRef(null);

  const dropdownList = [
    { icon: IconUser, name: 'My account', onClick: () => Router.push('/account/profile/personal') },
    { icon: IconMessage, name: 'Messages', onClick: () => Router.push('/chat') },
    { icon: IconShieldCheck, name: 'Support', onClick: () => Router.push('/support') },
    { icon: IconSettings, name: 'Settings', onClick: () => Router.push('/settings/notifications') },
    { icon: IconLogout, name: 'Sign out', onClick: () => dispatch(auth.thunks.logout()) },
  ];

  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);
  
  useEffect(() => {
    const handleRouteChange = () => setDropdownIsVisible(false);
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  const toggleMenu = () => {
    setDropdownIsVisible(!dropdownIsVisible)
    bodyOverflow(768);
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
                <img
                  src={item.icon.src}
                  alt=""
                  className="icon-default icon-default--xs"
                />
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
      <div
        ref={mobileMenu}
        className="d-flex align-items-center px-2 px-md-0 cursor-pointer"
        onClick={toggleMenu}
      >
        <div className={styles.name}>
          <div className="text-lg text-semibold text-gilroy">
            {userProfile.name}
          </div>
          <IconChevronRight
            size="xs"
            className={cn(
              'ml-1',
              dropdownIsVisible ? 'rotate-270' : 'rotate-90'
            )}
          />
        </div>
        <div className={styles.burger}>
          <IconMobileMenu isOpen={dropdownIsVisible}/>
        </div>
      </div>
      {dropdownIsVisible && (
        <Dropdown/>
      )}
    </div>
  );
}

export default SettingsList;
