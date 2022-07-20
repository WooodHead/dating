import { useState } from "react";
import cn from "classnames";
import styles from "./index.module.scss";
import PublicBoxTitle from "../PublicBoxTitle";
import { useSelector, useDispatch } from 'react-redux';
import { userProfile } from "store/user/profile";
import Link from 'next/link'
import { useRouter } from "next/router";

function PublicPhoto() {
  const links = [
    { href: 'main-photos', name: 'Main photos', count: 10, desc: 'Photos' },
    { href: 'public-albums', name: 'Public albums', count: 10, desc: 'Albums' },
    { href: 'private-albums', name: 'Private albums', count: 10, desc: 'Albums' },
  ];
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);
  const router = useRouter()

   const handleOnTabClick = (href) => {

   const areAccessibleAlbums = !profile.isPremiumUser && href === 'public-albums' ||
         !profile.isPremiumUser && href === 'private-albums';

   if (areAccessibleAlbums) {
        dispatch(userProfile.actions.TOGGLE_POPUP(true));
        return;
   }

    router.push(`${router.query.userId}/${href}`);
   }
  
  return (
    <div className="mb-4">
      <PublicBoxTitle>Photo / albums</PublicBoxTitle>
      <div className={cn(
        styles.wrap,
        'px-4 px-lg-0'
      )}>
        {links.map(({ href, name, count, desc }) => (
          <div
            key={href}
            onClick={() => handleOnTabClick(href)}
          >
            <div className={cn(
              styles.card,
              'color-blue-900 cursor-pointer'
            )}
            >
              <div className={styles['card__img']}>
                <img
                  src="/img/profile/albums-preview-bg.jpg"
                  alt="" />
              </div>
              <div>
                <div className="text-semibold text-lg mt-1">{name}</div>
                {/*<div className="text-md mt-1">{desc}</div>*/}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicPhoto;
