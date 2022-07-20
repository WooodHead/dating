import { prepareSelectOptions } from "utils/preps";

const selectors = {
  profile: state => state.publicProfile.profile,
  status: state => state.publicProfile.status,
  statusCode: state => state.publicProfile.statusCode,
  blockUserStatus: state => state.publicProfile.blockUserStatus,
  reportUserStatus: state => state.publicProfile.reportUserStatus,
  listOfReasons: state => prepareSelectOptions(state.publicProfile.listOfReasons),
  listOfReasonsStatus: state => state.publicProfile.listOfReasonsStatus,
};

export { selectors };
