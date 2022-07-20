import { useRouter } from "next/router";
import LinkBack from "components/LinkBack";

function PublicAlbumsHead({children}) {
  const router = useRouter();

  return (
    <>
      <LinkBack
        text="Back to profile"
        onClick={() => router.back()}
      />
      <div className="text-palatino text-bold title-xs mt-4 mb-3">
        {children}
      </div>
    </>
  )
}

export default PublicAlbumsHead