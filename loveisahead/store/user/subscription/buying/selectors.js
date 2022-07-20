const selectors = {
  plan: state => state.buyingSubscription.plan,
  planId: state => state.buyingSubscription.planId,
  buyStatus: state => state.buyingSubscription.buyStatus,
};

export { selectors };
