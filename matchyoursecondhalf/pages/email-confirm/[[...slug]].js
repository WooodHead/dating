import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emailVerification } from "store/emailVerification";

EmailVerification.accessMode = 'public';
EmailVerification.isBlank = true;

function EmailVerification() {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = router.query.slug;

  useEffect(() => {
    const verification = async () => {
      await dispatch(emailVerification.thunks.emailVerification(token[0]))
    }
    if(token) {
      verification()
    }
  }, [token])

  return (
    <></>
  )
}

export default EmailVerification