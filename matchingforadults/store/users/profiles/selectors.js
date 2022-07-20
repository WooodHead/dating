const selectors = {
  profiles: state => state.usersProfiles.profiles,
  status: state => state.usersProfiles.status,
  statusMore: state => state.usersProfiles.statusMore,
  pagination: state => state.usersProfiles.pagination,
  searchParams: state => state.usersProfiles.searchParams,
};

export { selectors };
