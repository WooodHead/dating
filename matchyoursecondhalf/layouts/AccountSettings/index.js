import MyProfile from "components/AccountPage/MyProfile";

function AccountProfileLayout({children}) {
  return (
    <div className="d-flex">
      <MyProfile>
        {children}
      </MyProfile>
    </div>
  );
}

export default AccountProfileLayout;
