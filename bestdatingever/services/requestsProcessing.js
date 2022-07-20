import { toast } from "react-toastify";

export default function requestProcessing(err) {
  console.error(err?.request);

  const errReq = err?.request;

  if (errReq?.status || errReq?.statusText) {
    return toast.error(`ERROR ${errReq?.status}: ${errReq?.statusText}`);
  }

  return toast.error('Something went wrong please try again later!');
}
