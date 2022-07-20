import { useRouter } from 'next/router';
import store from "store";

function AccessCheck(
  {
    children,
    mode = 'private' // 'public' | 'private' | 'all'
  }
) {
  const router = useRouter()
  const token = !!store.getState().auth.token;

  if (mode === 'private' && !token) {
    if (process.browser) router.replace('/')
    return null
  }

  if (mode === 'public' && token) {
    if (process.browser) router.replace('/')
    return null
  }

  return children
}

export default AccessCheck
