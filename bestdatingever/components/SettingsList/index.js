import {useState, useEffect, useRef} from "react";
import IconChevron from "components/icons/IconChevron";
import IconMobileMenu from "components/icons/IconMobileMenu";
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
    { name: 'My account', onClick: () => Router.push('/account/profile/personal') },
    { name: 'Messages', onClick: () => Router.push('/chat') },
    { name: 'Subscription', onClick: () => Router.push('/account/subscription') },
    { name: 'Support', onClick: () => Router.push('/support') },
    { name: 'Settings', onClick: () => Router.push('/settings/change-email') },
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
              <div className="text-md">
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
        className="d-flex align-items-center cursor-pointer"
        onClick={toggleMenu}
      >
        <div className={styles.name}>
          <div className="text-default text-semibold text-uppercase">
            {userProfile.name}
          </div>
          <IconChevron
            className={cn(
              'ml-1',
              { ['rotate-180']: dropdownIsVisible }
            )}
          />
        </div>
        <div className={styles.burger}>
          <IconMobileMenu isOpen={dropdownIsVisible} color="#4B5064"/>
        </div>
      </div>
      {dropdownIsVisible && (
        <Dropdown/>
      )}
    </div>
  );
}

export default SettingsList;
