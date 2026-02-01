
import React, { Suspense, lazy, useMemo ,useState, useContext} from "react";
import styles from "../styles/MenuBookGrid.module.css";
import ConfirmDialog from "./confirmDialog";
import { useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import defaultMessage from "../utils/defaultMessage";
import { UserContext } from "../ApiContext/userContext";
import FlashMessage from "./flashMessage";
import QrCodeModal from "./QrCodeModal";

const templateModules = import.meta.glob("../templates/**/*.jsx");
const menuBookModules = import.meta.glob("../templates/menuBooks/*.jsx");

export default function MenuBookGrid({ templates = []}) {
    const navigate = useNavigate();
    const {publicUser, setPublicUser} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [showProductionModal, setShowProductionModal] = useState(false);
    const [selectedMenuBook, setSelectedMenuBook] = useState(null);
    const [message, setMessage] = useState(defaultMessage);
    const [loading, setLoading] = useState(false);



    const templateMap = useMemo(() => {
        const out = {};
        for (const p of Object.keys(templateModules)) out[p] = lazy(templateModules[p]);
        return out;
    }, []);

    const menuBookMap = useMemo(() => {
        const out = {};
        for (const p of Object.keys(menuBookModules)) out[p] = lazy(menuBookModules[p]);
        return out;
    }, []);


    const handleMenuBookSelect = async (menuBook) => {
        if(!menuBook || !menuBook.id) return;
        setSelectedMenuBook(menuBook);
        if(menuBook.type !== "demo") {
            setShowProductionModal(true);
            return;
        }
        setShowModal(true);
    };

    const handlePreview = () => {
        navigate(`/${selectedMenuBook?.type}/menuBook/${selectedMenuBook?.id}?code=${selectedMenuBook?.menuBookCode}&template=${selectedMenuBook?.templateCode}`);
    };

    const handlebuyMenuBook = async () => {
        if(publicUser.token.tokens < selectedMenuBook.price) {
            setMessage({ visible:true, type: "error", msg: "Insufficient tokens. Please top up your account." });
            setShowModal(false);
            return;
        }
        try {
            setLoading(true);
            const response = await http.post(`/menu-book/buy/template/${selectedMenuBook.id}`, publicUser);          
            if(response?.data.success) {
               setMessage({ visible:true, type: "success", msg: "Menu Book purchased successfully!" });
               setPublicUser(response.data.data);
            }  
        } catch (error) {
            setMessage({ visible:true, type: "error", msg: httpMessage(error) });
        }
        finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const handleEditProductionMenuBook = () => {
        navigate(`/${selectedMenuBook?.type}/menuBook/${selectedMenuBook?.id}?code=${selectedMenuBook?.menuBookCode}&template=${selectedMenuBook?.templateCode}`);
    }
  
    return (
        <div className={styles.page}>
            <div className={styles.grid}>
                {templates.map((item, index) => {
                    // determine template and menuBook file names (fallbacks)
                    const templateCode = item?.templateCode
                    const menuBookCode = item?.menuBookCode 

                    const templatePath = `../templates/menu/${templateCode}.jsx`;
                    const menuBookPath = `../templates/menuBooks/${menuBookCode}.jsx`;

                    const LazyTemplate = templateMap[templatePath]
                    const LazyMenuBook = menuBookMap[menuBookPath]

                    return (
                        <div key={item.id ?? index} className={styles.card}>
                            <div className={styles.preview}>
                                <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
                                    {LazyMenuBook && LazyTemplate ?  (
                                        <LazyMenuBook data={item} onClick={(item) => handleMenuBookSelect(item)}>
                                            <LazyTemplate />
                                        </LazyMenuBook>
                                    ) : (
                                        <NoFoundTemplate />
                                    )}
                                </Suspense>
                            </div>

                            <div className={styles.meta}>
                                <div className={styles.title}>{item.heading || item.name}</div>
                                <div className={styles.subtitle}>{item.subheading}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ConfirmDialog
                open={showModal}
                title="Do you want to buy this template or preview it?"
                confirmText="Buy"
                cancelText="Preview"
                onCancel={handlePreview}
                onConfirm={handlebuyMenuBook}
                onClose={() => setShowModal(false)}
            />

            <QrCodeModal
                template={selectedMenuBook}
                open={showProductionModal}
                onClose={() => setShowProductionModal(false)}
                onEdit={(tem) => handleEditProductionMenuBook(tem)}
                onPublish={(tem) => console.log("Publish", tem)}
            />

            <FlashMessage show={message.visible} message={message.msg} type={message.type}  onClose={() => setMessage(defaultMessage)} />
        </div>
    );
}




function NoFoundTemplate({ onGoback }) {
  return (
    <div className={styles.notFoundWrap}>
      <div className={styles.notFoundCard}>
        <div className={styles.notFoundIcon}>🍕</div>
        <h2 className={styles.notFoundTitle}>Template Not Found</h2>
        <p className={styles.notFoundText}>
          The menu template you’re looking for doesn’t exist or was removed.
        </p>
        <button className={styles.notFoundBtn} onClick={onGoback}>
          Go Back
        </button>
      </div>
    </div>
  );
}
