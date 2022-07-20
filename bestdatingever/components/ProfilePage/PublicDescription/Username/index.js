import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import LastConnection from "../LastConnection";

function Username() {
  const { name, updatedAt, online, distance } = useSelector(publicProfile.selectors.profile);
  
  return (
    <div className="text-center mb-6">
      <div className="title-md text-black text-italic">
        {name}
      </div>
      <div className="text-italic color-cyan-500">
          <p>{distance}&nbsp;km from you</p>
          <LastConnection online={online} updatedAt={updatedAt} />
      </div>
    </div>
  );
}

export default Username;
