import Logo from "components/Logo";
import Link from "next/link";
import cn from "classnames";
import styles from './index.module.scss';

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={cn(styles['container-min-height'], 'container')}>
        <div className="d-flex flex-column">
          <div className={styles.nav}>
            <div className="d-flex">
              <Logo/>
            </div>
          </div>
          <div className={styles.contacts}>
            <div className={cn(
                styles.links,
                styles['contacts-wrapper'],
                'text-md text-semibold'
            )}>
              <Link href="/terms-of-use"><a>Term of Use</a></Link>
              <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
              <Link href="/contact"><a>Contact</a></Link>
            </div>
            <div className={cn(
              styles['contacts-wrapper'],
              styles['contacts-wrapper__address']
            )}>
              <div className="color-grey-200 mb-2 color-pink-500">
                Adress:
              </div>
              <div className="mb-1">
                Meletere Ltd
              </div>
              <div className="mb-4 mb-sm-1">
                Efesou 2, Block B, Flat 303, Nicosia, 1041, Cyprus
              </div>
            </div>
            <div className={cn(
              styles['contacts-wrapper'],
              styles['contacts-wrapper__info']
            )}>
              <div className="color-grey-200 mb-2 color-pink-500">
                Info:
              </div>
              <div className="mb-1">
                Director: Maria Demko
              </div>
              <div className="mb-1">
                REG#: HE 392139
              </div>
              <div className="mb-1">
                VAT: 10392139M
              </div>
              <div className="mb-1">
                Registrar of companies Nicosia
              </div>
            </div>
            <div className={cn(
              styles['contacts-wrapper'],
              styles['contacts-wrapper__support']
            )}>
              <div className="color-grey-200 mb-2 color-pink-500">
                Support team:
              </div>
              <div className="mb-2">
                <img
                    src="/img/footer/icon-mail.svg"
                    alt=""
                    className="icon-default mr-1"
                />
                support@lovehostages.com
              </div>
              <div>
                <img
                    src="/img/footer/icon-phone.svg"
                    alt=""
                    className="icon-default mr-1"
                />
                +357 22 051920
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className="container">
          © 2021 lovehostages.com. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
