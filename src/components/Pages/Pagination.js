import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ totalPage, handlePageChange, currentPage }) => {
  return (
    <ReactPaginate
      pageCount={totalPage}
      onPageChange={handlePageChange}
      containerClassName={'pagination'}
      activeClassName={'active'}
      previousLabel={'Previous'}
      nextLabel={'Next'}
      forcePage={currentPage - 1}
    />
  );
};

export default Pagination;