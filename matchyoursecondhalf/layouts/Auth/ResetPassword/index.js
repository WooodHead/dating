import Head from "next/head";
import styles from './index.module.scss';

function AuthLayout({children}) {
    return (
        <>
            <Head>
                <title>Dating | Login</title>
            </Head>
            <main className={styles.main}>
                {children}
            </main>
        </>
    );
}

export default AuthLayout;
