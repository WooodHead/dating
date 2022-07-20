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
              <Logo size="sm" />
            </div>
          </div>
          <div className={styles.contacts}>
            <div className={cn(
              styles.links,
              styles['contacts-wrapper'],
              'text-default text-uppercase'
            )}>
              <div className="text-xl text-semibold text-capitalize color-cyan-500 mb-3">
                Pages
              </div>
              <Link href="/terms-of-use"><a>Term of Use</a></Link>
              <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
              <Link href="/support"><a>Support</a></Link>
              <Link href="/contact"><a>Contact</a></Link>
            </div>
            
            <div className={cn(
              styles['contacts-wrapper'],
              styles['contacts-wrapper__address']
            )}>
              <img
                src="/img/footer/icon-location.svg"
                alt=""
              />
              <div className="text-xl text-semibold text-capitalize color-cyan-500 mb-3">
                Contact info
              </div>
              <div className="mb-2">
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
              <img
                src="/img/footer/icon-director.svg"
                alt=""
              />
              <div className="mt-7 mt-lg-0 mb-1">
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
              <div className="d-flex mt-7 mt-lg-0 mb-2">
                <img
                  src="/img/footer/icon-mail.svg"
                  alt=""
                  className="icon-default mr-1"
                />
                support@bestdatingever.com
              </div>
              <div className="d-flex">
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
          © 2021 bestdatingever.com. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
