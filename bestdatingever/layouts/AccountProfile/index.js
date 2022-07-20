import TopbarMenu from "components/AccountPage/TopbarMenu";

const routeList = [
  {
    id: 1,
    name: 'Profile',
    basePath: 'profile',
    link: '/account/profile/personal',
  },
  {
    id: 2,
    name: 'Main photos',
    basePath: 'photos/main-photos',
    link: '/account/photos/main-photos',
  },
  {
    id: 3,
    name: 'Public albums',
    basePath: 'photos/public-albums',
    link: '/account/photos/public-albums',
  },
  {
    id: 4,
    name: 'Private albums',
    basePath: 'photos/private-albums',
    link: '/account/photos/private-albums',
  },
];

function AccountProfileLayout({ children }) {
  return (
    <>
      <TopbarMenu routeList={routeList} />
      {children}
    </>
  );
}

export default AccountProfileLayout;
