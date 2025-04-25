import Header from "../../Layout/Header"
import Sidebar from "../../Layout/Sidebar"
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getDocsAsync, 
    documentsData, setCurrentPage, selectCurrentPage, docCount, uploadFileError,
    uploadFileStatus, productStatus, resetState} from "../../../features/scrapingSlice";
import Table from 'react-bootstrap/Table';
import Loader from "../../loader";
import { Dropdown } from "react-bootstrap";
import IcoMore from "../../../assets/images/more.svg";
import { showConfirmationDialog } from "../../../utils/SweetAlert";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import AddProduct from "./AddProduct";
import UploadDoc from "./UploadDoc";
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const UploadProducts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [offset, setOffset] = useState(0);
    const [totalPage, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [order, setOrder] = useState(null);


    const currentPage = useSelector(selectCurrentPage);
    const documents = useSelector(documentsData);
    const getcount = useSelector(docCount);
    const status = useSelector(uploadFileStatus);
    const uploadError = useSelector(uploadFileError);
    const productAddStatus = useSelector(productStatus);

    useEffect(() => {
      dispatch(getDocsAsync({ currentPage, perPage, order }))
          .finally(() => setIsLoading(false));
    }, [currentPage, perPage, dispatch]);

    useEffect(() => {
      if (getcount && perPage) {
        const pages = Math.ceil(getcount / perPage);
        setTotalPages(pages);
      }
    }, [getcount, perPage]);

    useEffect(() => {
      if(status == 'succeeded') {
        toast.success('File Imported Successfully.');
        dispatch(getDocsAsync({ currentPage, perPage, order }))
        navigateToSettings();
      } else if (status == 'failed' && uploadError) {
        toast.error(uploadError);
      }
    }, [status, uploadError, dispatch, currentPage, perPage, order]);

    useEffect(() => {
      if(productAddStatus === true) {
        toast.success('Product Added Successfully!')
      }
  
    }, [productAddStatus]);

    useEffect(() => {
      return () => {
        dispatch(resetState()); // Clear state when the component unmounts
      };
    }, [dispatch]);

    const handleDropdownClick = (e) => {
      e.stopPropagation();
    };
      
    const openUploadProp = () => {
      setIsUploadPopupOpen(true);
    }

    const addProduct = () => {
      setIsPopupOpen(true);
    };

    const closeUploadPopup = () => {
      setIsUploadPopupOpen(false);
    };

    const closeAddPopup = () => {
      setIsPopupOpen(false);
    };

    const handleSort = (column) => {
        const newDirection = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
        const order = (newDirection == 'desc' ? '-'+column : column);
        setOrder(order);
        dispatch(getDocsAsync({currentPage, perPage, order}))
    };

    const renderSerialNumber = (index) => {
        return index + offset + 1;
    };

    const handlePageChange = ({ selected }) => {
        dispatch(setCurrentPage(selected + 1));
        const currentPage = selected + 1;
        dispatch(getDocsAsync({currentPage, perPage, order}));
        setOffset(selected * perPage);
    };

    const navigateToSettings = () => {
      showConfirmationDialog(
        'Are you sure to want to go to scraping settings?',
        '',
        'question',
        'Yes, Go To Settings!',
        'No, cancel',
        true,
        async () => {
          navigate('/settings');
      }
      );
  };

    const handleDownloadDoc = (file, filename) => {
      const anchor = document.createElement('a');
      anchor.href = file;
      anchor.download = filename;
      anchor.click();
    }

    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
          <Header />
          <div className="common-layout">
            <h2 className="page-title mb-4">Documents</h2>  
            <div className="table-wrapper">
              <div className="table-search d-md-flex align-items-center justify-content-between">
                <div className="position-relative d-md-flex">
                  {/* <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                  /> */}
                  
                  {/* <button className='primary-button ms-2' onClick={addProduct}>Add Product</button> */}
                </div>
                <div className="position-relative d-md-flex">
                  <button className='primary-button ms-auto' onClick={openUploadProp}>Upload Document</button>
                </div>
              </div>
              <Table striped>
                <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Document Name</th>
                      {/* <th onClick={() => handleSort('price')}>Your Price {sortColumn === 'price' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}</th> */}
                      <th>Total Products</th>
                      <th>New Products</th>
                      <th>Uploaded Date</th>
                      <th style={{width: "40px"}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {isLoading ? (
                  <Loader />
                ) : 
                (documents && documents.length === 0) ?  (
                    <tr>
                    <td colSpan="6" className="text-center">No data found</td>
                    </tr>
                ) : (
                documents && documents.length > 0 && documents.map((document, i) => {
                  return (
                  <tr key={i} className="product-click">
                    <td>{renderSerialNumber(i)}</td>
                    <td>{document.file_name}</td>
                    <td>{document.total_products}</td>
                    <td>{document.new_products}</td>
                    <td>{document.uploaded_at}</td>
                    <td>
                      <Dropdown onClick={handleDropdownClick}>
                        <Dropdown.Toggle
                          className="transparent-button"
                          id="dropdown-basic"
                        >
                          <img src={IcoMore} width={18} height={18} alt="More" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            href="#"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDoc(document.file, document.file_name);
                            }}
                          >
                            Download
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                )})
                  )}
              </tbody>
              </Table>
              {isPopupOpen && (
              <Modal backdrop="static" size="md" show={isPopupOpen} onHide={() => setIsPopupOpen(false)}>
                  <Modal.Header closeButton> Add Product </Modal.Header>
                  <Modal.Body><AddProduct onClose={closeAddPopup}/> </Modal.Body>
              </Modal>
              )}
              {isUploadPopupOpen && (
              <Modal backdrop="static" size="md" show={isUploadPopupOpen} onHide={() => setIsUploadPopupOpen(false)}>
                  <Modal.Header closeButton> Upload Document </Modal.Header>
                  <Modal.Body><UploadDoc onClose={closeUploadPopup}/> </Modal.Body>
              </Modal>
              )}
            </div>
            <ReactPaginate
              pageCount={totalPage}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
              previousLabel={'Previous'}
              nextLabel={'Next'}
              forcePage={currentPage - 1}
            />
          </div>
        </div>
      </div>
    );
};

export default UploadProducts;