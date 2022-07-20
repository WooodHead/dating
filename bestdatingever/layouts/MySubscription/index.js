import TopbarMenu from "components/AccountPage/TopbarMenu";

const routeList = [
  {
    id: 1,
    name: 'My Subscription',
    basePath: 'subscription',
    link: '/account/subscription',
  },
  {
    id: 2,
    name: 'Transaction',
    basePath: 'account/transaction',
    link: '/account/transaction',
  },
];

function MySubscription({children}) {
  return (
    <div>
      <TopbarMenu routeList={routeList} />
      {children}
    </div>
  );
}

export default MySubscription;
