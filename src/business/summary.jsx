import { useEffect, useRef, useState, useContext } from "react";
import BusinessSidebar from "../components_business/businessSidebar";
import styles from "../styles/BusinessSummary.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import { UserContext } from "../ApiContext/userContext";

import FlashMessage from "../components/flashMessage";
import SummaryBoard from "./summary_components/summaryBoard";


export default function BusinessSummary() {
    const fetchRef = useRef(false);
    const { publicUser } = useContext(UserContext);
    const [summaryData, setSummaryData] = useState({});
    const [message, setMessage] = useState({visible: false, msg: "", type: ""});

    useEffect(() => {
        const fetchSummaryData = async () => {
        try {
            const response = await http.get(`/business/${publicUser?.business?.id}/summary`);
            setSummaryData(response.data?.data);
        } catch (error) {
            console.error("Error fetching summary data:", error);
            setMessage({visible: true, msg: httpMessage.getErrorMessage(error), type: "error"});
        }
        };

        if (fetchRef.current) return;
        fetchRef.current = true;
        fetchSummaryData();
    }, []);

    return (
        <div className={styles.shell}>
            <BusinessSidebar />

            <div className={styles.main}>
                <SummaryBoard data={summaryData}/>
            </div>


            <FlashMessage
                visible={message.visible}
                message={message.msg}
                type={message.type}
                onClose={() => setMessage({visible: false, msg: "", type: ""})}
            />
        </div>
    );
}