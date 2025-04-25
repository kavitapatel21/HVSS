import React from 'react';
import Sidebar from '../../Layout/Sidebar';
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../Layout/Header';
import { Modal } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import { Link, useLocation } from 'react-router-dom';
import Back from "../../../assets/images/arrow-left-solid.svg"
import Info from "../../../assets/images/info.svg";
import { productDetailsAsync, productDetails, productScrapDetailsAsync, 
    productScrapDetails, totalScrollPage, downloadProdReportAsync, productReport, 
    clearProductReport, clearScrapDetails, clearProductDetails } from "../../../features/scrapingSlice";
import Loader from '../../loader';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const location = useLocation();
    const { product } = location.state || {};
    const dispatch = useDispatch();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const details = useSelector(productDetails);
    const scrapedDetails = useSelector(productScrapDetails);
    const productRepExcel = useSelector(productReport);
    const [datesArray, setDatesArray] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // const [page, setPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);
    const [history, setHistory] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [file, setFile] = useState('');
    const tableRef = useRef(null);
    const [dateSize, setDateSize] = useState(0);
    const [ hasMore, setHasMore ] = useState(true);
    const [previousDateSize, setPreviousDateSize] = useState(0);

    const handleProductClick = (productId) => {
        setIsPopupOpen(true);
        dispatch(productDetailsAsync(productId));
        dispatch(clearProductDetails());
    }

    useEffect(() => {
        if (product && product.id) {
            setIsLoading(true);
            dispatch(productScrapDetailsAsync({ product_id: product.id, history_page_size: 7, history_page: history })).finally(() => setIsLoading(false));
        }
    }, [dispatch, product.id]);

    useEffect(() => {
        if (productRepExcel) {
            downloadExcel(productRepExcel);
            dispatch(clearProductReport());
        }
    }, [productRepExcel]);

    const fetchProductData = async (newHistory) => {
        setIsLoading(true);
        setIsFetching(true);
        dispatch(productScrapDetailsAsync({ product_id: product.id, history_page_size: 7, history_page: newHistory })).finally(() => setIsLoading(false));
        setIsFetching(false);
    };
    
    const transformData = (data) => {
        const allDates = new Set();
        const allData = new Map();
        data.forEach(product => {
            product.price_histories.forEach(price => {
                allDates.add(price.created_at);
            });
        });

        const newDateSize = allDates.size;
        setDateSize(newDateSize);
        console.log('new date: ' + newDateSize);
        console.log('date: ' + dateSize);
        console.log('previous date: ' + previousDateSize);
        if (newDateSize !== previousDateSize && newDateSize != 0) {
            setPreviousDateSize(dateSize);
            setHasMore(true);
        } else {
            setHasMore(false);
        }
        
        const datesArray = Array.from(allDates).sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('-').map(Number);
            const [dayB, monthB, yearB] = b.split('-').map(Number);
            
            // Create date objects for comparison
            const dateA = new Date(yearA, monthA - 1, dayA); // Month is 0-based
            const dateB = new Date(yearB, monthB - 1, dayB);
    
            return dateB - dateA; // Sort in descending order
        });

        data.map(product => {
            const prices = datesArray.map(date => {
                const priceEntry = product.price_histories.find(price => price.created_at === date);
                return priceEntry && priceEntry.price != null ? priceEntry.price : '-';
            });

            if (!allData.has(product.url)) {
                allData.set(product.url, {
                    ...product,
                    prices
                });
            } else {
                // If it already exists, merge new prices with existing prices by combining
                const existingProduct = allData.get(product.url);
                // Merge the prices for each date
                existingProduct.prices = existingProduct.prices.map((existingPrice, index) => {
                    const newPrice = prices[index];
                    return existingPrice === '-' ? newPrice : existingPrice;
                });
    
                // Update the existing product in the map
                allData.set(product.url, existingProduct);
            }
        });

        const tableData = Array.from(allData.values());
        return { datesArray, tableData };
    };

    useEffect(() => {
        if (scrapedDetails && Array.isArray(scrapedDetails)) {
            const { datesArray, tableData } = transformData(scrapedDetails);
            
            // Sort from highest to lowest
            setDatesArray(prev => {
                const uniqueDates = Array.from(new Set([...prev, ...datesArray]));
                
                return uniqueDates.sort((a, b) => {
                    const [dayA, monthA, yearA] = a.split('-').map(Number);
                    const [dayB, monthB, yearB] = b.split('-').map(Number);
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateB - dateA; 
                });
            });
    
            // Append new data to the existing table data
            setTableData(prev => {
                return [...prev, ...tableData];
            });
    
            // Update visible items if necessary
            setVisibleItems(tableData);
        }
    }, [scrapedDetails]);
    

    const handleScroll = useCallback(() => {
        if (tableRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
            
            // Horizontal Scroll
            if (scrollLeft + clientWidth >= scrollWidth - 1 && !isFetching && hasMore) {
                setHistory(prevHistory => {
                    const newHistory = prevHistory + 1;
                    fetchProductData(newHistory);
                    return newHistory; // Update history after fetching data
                });
            
            }
            // // Vertical Scroll
            // if (scrollTop + clientHeight >= scrollHeight - 1 && !isFetching) {
            //     if (page < totalScrollPages) {
            //         setPage(prevPage => prevPage + 1);
            //         fetchProductData();
            //     }                
            // }
        }
    }, [isFetching, history, hasMore]);

    useEffect(() => {
        const ref = tableRef.current;
        if (ref) {
            ref.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (ref) {
                ref.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);
    
    const downloadProdData = (productId) => {
        dispatch(downloadProdReportAsync(productId));
    }

    const downloadExcel = (file) => {
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'price_history_report.xlsx'; // Filename
        document.body.appendChild(a);
        a.click(); // Trigger the download
        a.remove();
    }

    const clearState = () => {
        dispatch(clearScrapDetails()); // Dispatch action to clear state in Redux
    };

    useEffect(() => {
        return () => {
            clearState(); // Clear state when component unmounts
        };
    }, [dispatch]);
  
    return (
        <div className="d-flex">  
            {/* <Loader /> */}
            <Sidebar />
            <div className="page-wrapper">         
                <Header />
                <div className="common-layout">
                    <div className="d-md-flex align-items-center justify-content-between mb-4">
                        <h2 className="page-title mb-md-0 mb-3">Product Scraping Details</h2>
                        <div className="back-button mb-2">
                            <Link to="/results" onClick={clearState} className="back-link d-flex align-items-left">
                                <img src={Back} width={18} height={18} className="me-2" alt="Back" />
                                Back
                            </Link>
                        </div> 
                    </div>
                    <div className="table-wrapper">
                        <div className="table-search d-md-flex align-items-center justify-content-between">
                            <div className="position-relative d-md-flex">
                                <h6>Product Name: {product.name} ({product.manufacturer})</h6> 
                            </div>
                            <div className="position-relative d-md-flex">
                                <button className='primary-button ms-auto' onClick={() => downloadProdData(product.id)} disabled={visibleItems.length === 0}>Download</button>
                            </div>
                        </div>
                        <div className="table-content" ref={tableRef}>
                            <Table className='table-details' striped>
                                <thead>
                                    <tr>
                                        <th className='product-url'>Websites</th>
                                        {/* <th></th> */}
                                        {datesArray.map(date => (
                                            <th key={date} className='dates-width text-center'>{date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                {isLoading ? (
                                    <Loader />
                                ) : 
                                (visibleItems && visibleItems.length === 0) ?  (
                                    <tr>
                                    <td colSpan="6" className="text-center">No data found</td>
                                    </tr>
                                ) : (
                                    visibleItems.map((product, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='product-url'>
                                                    <a className="product-link" title={product.url} href={product.url} target="_blank" rel="noopener noreferrer">
                                                        {product.url.length > 40 ? `${product.url.substring(0, 40)}...` : product.url}
                                                    </a>
                                                    <img src={Info} className="view-button info-icon" onClick={() => handleProductClick(product.id)} alt="View" width={20} height={20} />
                                                </td>
                                                {product.prices.map((price, i) => (
                                                    <td key={i} className='text-center dates-width'>{price}</td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </Table>
                        </div>
                        {isPopupOpen && (
                        <Modal backdrop="static" size="lg" show={isPopupOpen} onHide={() => setIsPopupOpen(false)}>
                            <Modal.Header closeButton> Product Details </Modal.Header>
                            <Modal.Body>
                            <div className="popup">
                                <div className="popup-inner">
                                    <div>
                                        <h5 className="me-3">{details.title}</h5>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <img
                                                className="mb-2"
                                                src={details.image}
                                                alt="Product"
                                                style={{ width: '20%', height: 'auto' }}
                                            />
                                        </div>
                                        <p>{details.description}</p>
                                        <p><strong>Product Code:</strong> {details.product_code}</p>
                                        <p><strong>SKU:</strong> {details.sku}</p>
                                        <p><strong>Lowest Price:</strong> {details.price_symbol} {details.price}</p>
                                    </div>
                                </div>
                            </div>
                            </Modal.Body>
                        </Modal>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;