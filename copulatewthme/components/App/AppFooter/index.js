import Logo from "components/Logo";
import Link from "next/link";
import cn from "classnames";
import styles from './index.module.scss';

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.nav}>
          <div className={cn(
            styles['nav__logo'],
            'd-flex'
          )}>
            <Logo/>
          </div>
          <div className={cn(
            styles.links,
            'text-md text-medium'
          )}>
            <Link href="/terms-of-use"><a>Term of Use</a></Link>
            <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
            <Link href="/refund-policy"><a>Refund Policy</a></Link>
            <Link href="/contact"><a>Contact</a></Link>
          </div>
        </div>
        <div className={styles.contacts}>
          <div className={styles.info}>
            <div>
              <div className="color-grey-200 text-gilroy text-semibold mb-2">
                Meletere Ltd
              </div>
              <div className="mb-1">
                Efesou 2, Block B, Flat 303, Nicosia, 1041, Cyprus
              </div>
              <div className="mb-4 mb-lg-0">
                Director: Maria Demko
              </div>
            </div>
          <div>
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
          </div>
          <div className={styles.support}>
            <div className="color-grey-200 text-gilroy text-semibold mb-2">
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
          <div className={styles.social}>
            <div className="color-grey-200 text-gilroy text-semibold mb-2">
              Social networks:
            </div>
            <div>
              <img
                src="/img/footer/icon-twitter.svg"
                alt=""
                className="icon-default mr-3"
              />
              <img
                src="/img/footer/icon-facebook.svg"
                alt=""
                className="icon-default mr-3"
              />
              <img
                src="/img/footer/icon-instagram.svg"
                alt=""
                className="icon-default"
              />
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © 2021 lovehostages.com. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
