import {useState, useRef, useEffect} from "react";
import IconChevronRight from "components/icons/IconChevronRight";
import OutsideAlerter from "hooks/ClickOutside";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";
import cn from "classnames";
import styles from './index.module.scss';
import IconMobileMenu from "components/icons/IconMobileMenu";

function SettingsList({ userProfile }) {
  const dispatch = useDispatch();
  const mobileMenu = useRef(null);

  const dropdownList = [
    { name: 'My Profile', onClick: () => Router.push('/account/profile/personal') },
    { name: 'My Photos', onClick: () => Router.push('/account/photos/main-photos') },
    { name: 'Messages', onClick: () => Router.push('/chat') },
    { name: 'Subscription', onClick: () => Router.push('/account/subscription') },
    { name: 'Support', onClick: () => Router.push('/support') },
    { name: 'Settings', onClick: () => Router.push('/account/settings/change-email') },
    { name: 'Sign out', onClick: () => dispatch(auth.thunks.logout()) },
  ];

  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);

  const Dropdown = () => {

    useEffect(() => {
      return () => setDropdownIsVisible(false)
    })

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
        onClick={() => setDropdownIsVisible(!dropdownIsVisible)}
      >
        <div className={styles.name}>
          <div className="text-lg color-blue-900">
            {userProfile.name}
          </div>
          <IconChevronRight
            size="xs"
            color="#01213D"
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
        <Dropdown />
      )}
    </div>
  );
}

export default SettingsList;
