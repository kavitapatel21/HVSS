import Header from "../../Layout/Header"
import Sidebar from "../../Layout/Sidebar"
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getProductsAsync, 
  productsData, selectCurrentPage, count,
  resetState, page, hasmore, setProductPage, resetProducts, getDocsAsync, documentsData, 
  getExportProducts, exportProducts, downloadProdError, clearProductsData } from "../../../features/scrapingSlice";
import 'react-clock/dist/Clock.css';
import { useNavigate } from 'react-router-dom';
import IcoSearch from "../../../assets/images/search_ico.svg"
import NoImage from "../../../assets/images/no-image.png";
import { Dropdown } from "react-bootstrap";
import Loader from "../../loader";

const Results = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Processing...');
  const [totalPage, setTotalPages] = useState(0);
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const dispatch = useDispatch();
  const getcount = useSelector(count);
  
  const currentPage = useSelector(selectCurrentPage);
  const products = useSelector(productsData);
  const getpage = useSelector(page);
  const hasMore = useSelector(hasmore);
  const documents = useSelector(documentsData);
  const containerRef = useRef(null);
  const downloadProds = useSelector(exportProducts);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getProductsAsync({ getpage, searchQuery, selectedDoc })).finally(() => setIsLoading(false));
    dispatch(getDocsAsync());
  }, [dispatch, getpage, searchQuery, selectedDoc]);

  useEffect(() => {
    return () => {
      dispatch(resetProducts());
    };
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5 && hasMore && !isLoading) {
      dispatch(setProductPage(getpage + 1));
    }
  }, [dispatch, getpage, hasMore, isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const previousHeight = container.scrollHeight;

      if (getpage > 1) {
        setTimeout(() => {
          const newHeight = container.scrollHeight;
          const scrollDiff = newHeight - previousHeight;
  
          container.scrollTop += scrollDiff;
        }, 0);
      }
    }
  }, [products]);
  
  useEffect(() => {
    if (getcount && perPage) {
      const pages = Math.ceil(getcount / perPage);
      setTotalPages(pages);
    }
  }, [getcount, perPage]);

  useEffect(() => {
    if (downloadProds) {
        downloadExcel(downloadProds);
        dispatch(clearProductsData());
    }
  }, [downloadProds]);

  const renderSerialNumber = (index) => {
    return index + offset + 1;
  };

  const handleSort = (column, direction) => {
    const ordering = (direction == 'desc' ? '-'+column : column);
    setOrder(direction);
    if (direction == 'desc') {
      setSelectedOption('Price - High to Low')
    } else {
      setSelectedOption('Price - Low to High')
    }
    dispatch(getProductsAsync({ getpage, searchQuery, selectedDoc, ordering }));
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const handleSearchProduct = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleDocumentClick = (eventKey) => {
    setSelectedDoc(eventKey);
  };

  const handleDownload = () => {
    setMessage('Please wait, we are preparing the file!');
    setIsLoading(true);
    dispatch(getExportProducts())
    .finally(() => {
      setIsLoading(false);
      setMessage('Processing...');
    });
  };

  // Prevent body from scrolling when container is used
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const downloadExcel = (file) => {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_result.xlsx'; // Filename
    document.body.appendChild(a);
    a.click(); // Trigger the download
    a.remove();
  }
      
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper">         
        <Header />
        <div className="common-layout" ref={containerRef} id="product-container"
      style={{ overflowY: 'auto', maxHeight: '800px' }}>
          <div className="position-relative d-md-flex justify-content-between">
            <h2 className="page-title mb-4">Scraping Results</h2>
              <div className="position-relative d-md-flex">
                <button className='primary-button ms-auto' onClick={handleDownload} disabled={products.length === 0 || isLoading === true}>
                Download Results
                </button>
              </div>
          </div>
          <div className="search-product-data mb-4 d-flex">
            <div className="table-product-search px-0 d-md-flex align-items-center position-relative">
              <img src={IcoSearch} className="ico_float left" alt="Search Here" />
              <input type="text" placeholder="Search" id="search" name="search" value={searchQuery} onChange={handleSearchProduct} />
            </div>
            <div className="dropdown-filter d-md-flex align-items-center">
              <Dropdown align="start">
                <Dropdown.Toggle id="dropdown-basic" className="outline-button me-0 ms-2">
                {selectedOption ? selectedOption : 'Sort By : Price'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSort('latest_price', 'desc')} active={order == 'desc'}>
                    Price - High to Low
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('latest_price', 'asc')} active={order == 'asc'}>
                    Price - Low to High
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown align="start" onSelect={handleDocumentClick}>
                <Dropdown.Toggle id="dropdown-basic" className="outline-button me-0 ms-2">
                  {selectedDoc && selectedDoc != 0 ?
                  documents.find(doc => doc.id == selectedDoc).file_name
                  : 'Select Document'
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item key="0" eventKey="0" active={selectedDoc == 0}>
                    Select Document
                  </Dropdown.Item>
                  {documents && documents.map(docs => (
                  docs.total_products > 0 ? (
                    <Dropdown.Item key={docs.id} eventKey={docs.id} active={selectedDoc === docs.id}>
                      {docs.file_name}
                    </Dropdown.Item>
                  ) : null
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="table-wrapper">
            <div className='product-grid'>
            {isLoading ? (
              <Loader message={message}/>
            ) : 
            (products && products.length === 0) ?  (
                <div>No data found</div>
            ) : 
            (products && products.length > 0 && products.map((product, i) =>  {
              return (
              <div key={product.id} className="product-wrapper" onClick={() => handleProductClick(product)}>
                <div className="product-card product-click">
                  <img src={product.image ? product.image : NoImage} alt={product.name}/>
                  <p className='product-name' title={product.name}>{product.name}</p>
                  <p className="product-code">{product.model_number}</p>
                  <h6>{product.latest_price}</h6>
                </div>
              </div>
            )})
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;