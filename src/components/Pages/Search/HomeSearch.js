import Header from "../../../components/Layout/Header"
import Sidebar from "../../../components/Layout/Sidebar"
import "../../../assets/scss/search.scss";
import IcoSearch from "../../../assets/images/search_ico.svg"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getCodeDetailsAsync, codedetails, codeError } from "../../../features/homeSearchSlice";
import SubLoader from "../../inner_loader";

const HomeSearch = () => {
    const dispatch = useDispatch();
    const details = useSelector(codedetails);
    const error = useSelector(codeError);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchQuery != '') {
            setIsLoading(true);
            dispatch(getCodeDetailsAsync(searchQuery))
                .finally(() => setIsLoading(false));
        }
    }, [dispatch, searchQuery]);

    const handleSearch = (event) => {
        const query = event.target.value;
        console.log(query);
        setSearchQuery(query);
    };

    const alldetails = Object.entries(details ?? {}).map(([key, value]) => ({ key, value }));

    return (
    <div className="d-flex">  
        <Sidebar />
        <div className="page-wrapper search position-relative">         
            <Header />
            <div className="common-layout">
                <h2 className="page-title mb-4">Search</h2> 
                <div className="table-wrapper py-4">
                    <div className="search-data mx-auto">
                        <div className="table-search px-0">
                            <div className="position-relative">
                                <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                                <input type="text" placeholder="Search" id="search" name="search" value={searchQuery} onChange={handleSearch} />
                            </div>
                        </div>
                        <table className="mt-4">
                            <thead>
                                <tr>
                                    <th style={{width: "30%"}}>Code</th>
                                    <th style={{width: "70%"}}>Description</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <SubLoader />
                            ) : (
                                (alldetails.length === 0 || searchQuery === '') ? (
                                    <tr>
                                        <td colSpan="2" className="text-center">No data found</td>
                                    </tr>
                                ) : (
                                    alldetails.map((detail, i) => (
                                        <tr key={i}>
                                            <td>{detail.key}</td>
                                            <td>{detail.value}</td> 
                                        </tr>
                                    ))
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  };
export default HomeSearch;