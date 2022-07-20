import AuthLayout from 'layouts/Auth';
import cn from "classnames";
import styles from './index.module.scss'
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { emailVerification } from "store/emailVerification";
import { useMemo } from "react";
import Button from "components/Button";
import { useRouter } from "next/router";

AccountVerified.accessMode = 'public'
AccountVerified.layouts = [AuthLayout]

function AccountVerified() {
  const router = useRouter();
  const dispatch = useDispatch();

  const profile = useSelector(userProfile.selectors.profile);
  const verificationStatus = useSelector(emailVerification.selectors.verificationStatus);

  const email = useMemo(() => {
    return router.query.email ||  profile.email
  }, [router.query, profile])

  const handleResend = async () => {
    await dispatch(emailVerification.thunks.emailVerificationResend({email}));
  }

  return (
    <div className={cn(
      styles.container,
      'container'
    )}>
      <div className={cn(
        styles.form,
        'form-overlay mx-auto'
      )}>
        <div className="text-lg">
          Sorry, your account is not verified, check your mail and spam folder <span className={styles['mail-text']}>{email}</span>
        </div>
        <div className="d-flex justify-content-center">
          <Button
            text="Resend"
            className="mt-3"
            outline
            textSize="md"
            loader={verificationStatus === 'pending'}
            onClick={handleResend}
          />
        </div>
      </div>
    </div>
  )
}

export default AccountVerified