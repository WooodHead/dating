import LinkBack from "components/LinkBack";
import { useRouter } from "next/router";
import styles from './index.module.scss'
import cn from "classnames";

function PublicAlbumsHead({children}) {
  const router = useRouter();

  return (
    <>
      <LinkBack
        text="Back to profile"
        onClick={() => router.back()}
      />
      <div className={cn(
        styles.title,
        'text-poppins text-medium text-xl text-uppercase'
      )}
      >
        {children}
      </div>
    </>
  )
}

export default PublicAlbumsHead