import MainLayout from "layouts/Main";
import Page404 from "components/ErrorsPages/Page404";

PageNotFound.layouts = [MainLayout];
PageNotFound.accessMode = 'all';

function PageNotFound() {
  return <Page404/>;
}

export default PageNotFound;