
import React, { Suspense, lazy, useMemo ,useState, useContext} from "react";
import styles from "../styles/MenuBookGrid.module.css";
import ConfirmDialog from "./confirmDialog";
import NoFoundTemplate from "./noFoundTemplate";
import { useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import defaultMessage from "../utils/defaultMessage";
import { UserContext } from "../ApiContext/userContext";
import FlashMessage from "./flashMessage";
import QrCodeModal from "./QrCodeModal";
import LoadingModal from "../components/loading";

const VITE_PUBLIC_TEMPLATE_URL = import.meta.env.VITE_APP_PUBLIC_URL;

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
            const response = await http.post(`/menu-book/buy/template/${selectedMenuBook.id}/uid/${publicUser.uid}`, publicUser);          
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


    const handleSetTemplateStatus = async (menuBook, status) => {
        try{
           
            setLoading(true);
            menuBook.isPublic = !status;
            const res = await http.put(`/menu-book/status`, menuBook);
            if (res.data.success) {
                setMessage({
                visible: true,
                type: "success",
                msg: menuBook.isPublic ? "Set public menu book." : "Set private menu book."});

                templates.map((item) =>
                item.id === menuBook.id ? { ...item, isPublic: !status } : item
            )
            }
        }
            catch(error){
            setMessage({ visible:true, type: "error", msg: httpMessage(error) });
        }
        finally{
            setLoading(false);
        }
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

                    const isContentsEmpty = !item.contents || (Array.isArray(item.contents) && item.contents.length === 0);

                    return (
                        <div key={item.id ?? index} className={styles.card}>
                            <div className={styles.preview}>
                                {isContentsEmpty ? (
                                    <div className={styles.emptyState} onClick={() => handleMenuBookSelect(item)}>
                                        <div className={styles.addPageIcon}>+</div>
                                        <div className={styles.addPageText}>Add page</div>
                                    </div>
                                ) : (
                                <>
                                    <div className={styles.badgeWrap}>
                                        {item?.type === "production" && <StatusBadge item={item} />}
                                    </div>
                                    <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
                                        {LazyMenuBook && LazyTemplate ?  (
                                            <LazyMenuBook data={item}  pressable onPress={(item) => handleMenuBookSelect(item)}>
                                                <LazyTemplate/>
                                            </LazyMenuBook>
                                        ) : (
                                            <NoFoundTemplate onGoback={() => navigate("menu")}/>
                                        )}
                                    </Suspense>
                                </>
                                )}
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
                onPublish={(tem) => handleSetTemplateStatus(tem, tem?.isPublic)}
                qrValue={`${VITE_PUBLIC_TEMPLATE_URL}/menubook/${selectedMenuBook?.type}/template/${selectedMenuBook?.id}?code=${selectedMenuBook?.menuBookCode}&template=${selectedMenuBook?.templateCode}&public=${selectedMenuBook?.publicCode?.String}`}
            />

            <LoadingModal open={loading}/>

            <FlashMessage show={message.visible} message={message.msg} type={message.type}  onClose={() => setMessage(defaultMessage)} />
        </div>
    );
}




const StatusBadge = ({ item }) => {
  const isPublic = !!item?.isPublic;
  return (
    <div
      className={styles.badge}
      data-public={isPublic ? "true" : "false"}
      title={isPublic ? "Public" : "Private"}
    >
      {isPublic ? "Public" : "Private"}
    </div>
  );
};