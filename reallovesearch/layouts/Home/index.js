import Head from "next/head";
import cn from "classnames";
import styles from "./index.module.scss";

function HomeLayout({ children, disableYOffset }) {
  return (
    <>
      <Head>
        <title>Dating</title>
      </Head>
      <main className={cn(
        styles.main,
        {'pt-3': !disableYOffset}
      )}>
        <div className="container">
          {children}
        </div>
      </main>
    </>
  );
}

export default HomeLayout;
