import RcPagination from 'rc-pagination';
import IconChevronLeft from "components/icons/IconChevronLeft";
import IconChevronRight from "components/icons/IconChevronRight";

function Pagination(
  {
    current,
    total,
    pageSize,
    onChange
  }
) {
  const RenderPages = ({ current, type, element }) => {
    return type === 'page' ? current : element;
  };

  return (
    <RcPagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      itemRender={(current, type, element) => (
        <RenderPages
          current={current}
          type={type}
          element={element}
        />
      )}
      prevIcon={<IconChevronLeft color="#323B52"/>}
      nextIcon={<IconChevronRight color="#323B52"/>}
      jumpPrevIcon={'...'}
      jumpNextIcon={'...'}
    />
  );
}

export default Pagination;