import Link from "next/link";
import cn from "classnames";
import styles from './index.module.scss';

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        
        <div className={cn(styles.wrap, 'mb-1')}>
          <div className={cn(
            styles.links,
            'text-semibold'
          )}>
            <Link href="/terms-of-use"><a>Term of Use</a></Link>
            <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
            <Link href="/refund-policy"><a>Refund Policy</a></Link>
            <Link href="/contact"><a>Contact</a></Link>
          </div>
  
          <div className={styles.contacts}>
            <div className={styles.info}>
              <div className="text-semibold mb-2">
                Info:
              </div>
              <div className="mb-2">
                Director: Maria Demko
              </div>
              <div className="mb-2">
                REG#: HE 392139
              </div>
              <div className="mb-2">
                VAT: 10392139M
              </div>
              <div>
                Registrar of companies Nicosia
              </div>
            </div>
    
            <div className={styles.support}>
              <div className="text-semibold mb-2">
                Address:
              </div>
              <div className="mb-3">
                Efesou 2, Block B, Flat 303, Nicosia, 1041, Cyprus
              </div>
              <div className="text-semibold mb-2">
                Support team:
              </div>
              <div className="mb-2">
                support@matchingforadults.com
              </div>
              <div>
                +357 22 051920
              </div>
            </div>
          </div>
        </div>
        
        <div className={cn(styles.copyright, 'text-semibold')}>
          © 2021 matchingforadults.com. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
