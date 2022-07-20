import { useState } from "react";
import cn from "classnames";
import styles from "./index.module.scss";
import PersonalBoxTitle from "../PersonalBoxTitle";
import Link from 'next/link'
import { useRouter } from "next/router";

function PublicPhoto() {
  const links = [
    { href: 'main-photos', name: 'Main photos', count: 10 },
    { href: 'public-albums', name: 'Public albums', count: 10 },
    { href: 'private-albums', name: 'Private albums', count: 10 },
  ];

  const router = useRouter()

  return (
    <div className="mb-4">
      <PersonalBoxTitle>Photo / albums</PersonalBoxTitle>
      <div className={cn(
        styles.wrap,
      )}>
        {links.map(({href, name, count}) => (
          <Link
            href={`/account/photos/${href}`}
            key={href}>
            <div className={cn(
              styles.card,
              'color-blue-900 cursor-pointer'
            )}
            >
              <div className={styles['card__img']}>
                <div className={styles['card__content']}>
                  <img
                    src="/img/cards/icon-upload-photo.svg"
                    alt=""
                    className={styles.icon}
                  />
                  <div className={cn(
                    styles['card__text'],
                    'mt-3 text-semibold text-lg color-blue-900'
                  )}>
                    Add {name.toLowerCase()}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-semibold text-lg mt-1">{name}</div>
                <div className="text-md mt-1">{count} Photos</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PublicPhoto;
