import IconButton from "components/IconButton";
import Router from "next/router";
// import styles from "./index.module.scss";

function BreadCrumbs({ list }) {
  return (
    <div className="d-flex align-items-center">
      <IconButton onClick={() => Router.push('/')}>
        <img src="/img/general/icon-home.svg" alt="" className="icon-default"/>
      </IconButton>
      {list && Object.values(list).map(link => (
        <div key={link._id} className="d-flex align-items-center">
          <img src="/img/general/icon-double-arrow.svg" alt="" className="icon-default mr-1"/>
          {link.text}
        </div>
      ))}
    </div>
  );
}

export default BreadCrumbs;
