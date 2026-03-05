import { useState, useEffect, useRef } from "react";
import http from "../http/http";
import httpMessage from "../http/httpMessage";

import Navbar from "../components/Navbar";
import TemplateGrid from "../components/templateGrid";
import PagesRows from "../components/pagesRows";
import styles from "../styles/Demo.module.css";

export default function Demo() {
    const fetchingRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);


    useEffect(() => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;  
        handleGetTemplates(currentPage + 1);   
    }, []);

    const handleGetTemplates = async (page) => {
        try{
            setLoading(true);
            const res = await http.get(`/onboarding/demo/templates?page=${page}`);
            if(res.data.success){
                setTemplates(res.data.data);
                setTotalPages(res.data.totalPages);
                setTotalItems(res.data.totalItems);
                setCurrentPage(res.data.page);
            }
            }
            catch(err){
            console.log(httpMessage(err));
            }
            finally{
            setLoading(false);
        }
    }

    const handleNextPage = () => {
        if(currentPage < totalPages){
        handleGetTemplates(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if(currentPage > 0){
        handleGetTemplates(currentPage - 1);
        }
    }


    return(
        <main className={styles.page}>
            <Navbar />
            <div className={styles.heroHead}>
                <h3 className={styles.pageTitle}>3D menu template for you</h3>
            </div>
            <TemplateGrid templates={templates} action={false} />
            {totalPages > 1 && (
                <PagesRows 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={60}
                    totalItems={totalItems}
                    onPrev={() => handlePrevPage()}
                    onNext={() => handleNextPage()}
                    showingItems={templates.length}
                />
            )}
        </main>
    )
}