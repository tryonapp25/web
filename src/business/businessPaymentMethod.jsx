import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "../styles/BusinessPaymentMethod.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ApiContext/userContext";

import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import Sidebar from "../components_business/businessSidebar";

export default function BusinessPaymentMethod() {
    const { publicUser } = useContext(UserContext);
    const fetchRef = useRef(false);
    const navigate = useNavigate();


    const [stripeAccount, setStripeAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({visible: false, type: "", msg: ""});

    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (fetchRef.current) return;
        fetchRef.current = true;
        fetchBusinessAccountStatus();
    }, [navigate]);

    const handleCreateStripeAccount = async () => {
        try {
            setLoading(true);
            const res = await http.post("/stripe/create/business-account", publicUser);
            if (res.data.success) {
                setStripeAccount(res.data.data);
                console.log("Stripe account created:", res.data.data);
                setMessage({visible: true, type: "success", msg: "Stripe account created successfully."});
            }
        } catch (err) {
            console.error(httpMessage(err));
            setMessage({visible: true, type: "error", msg: "Failed to create Stripe account."});
        } finally {
            setLoading(false);
        }
    };

    const handleOnBoardingLink = async () => {
        try {
            setLoading(true);
            const res = await http.get(
                `/stripe/account/${stripeAccount?.stripeAccountId}/business/${publicUser?.business?.id}/onboarding-link`
            );

            if (res.data.success) {
                const { url } = res.data.data;
                window.location.href = url;
            }
        } catch (err) {
            console.error(httpMessage(err));
            setMessage({visible: true, type: "error", msg: "Failed to fetch onboarding link."});
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessAccountStatus = async () => {
        setLoading(true);
        try {
            const res = await http.get(`/stripe/account/business/${publicUser?.business?.id}`);

            if (res.data.success) {
                const account = res.data.data;
                setStripeAccount(account);

                const completed = account.payoutsEnabled && account.chargesEnabled;
                setIsComplete(completed);
            }
        } catch (err) {
            console.error(httpMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if(stripeAccount === null) return(
        <div className={styles.shell}>
            <Sidebar />

            <div className={styles.main}>
               <h1 className={styles.loadingText}>Loading payment information...</h1>
            </div>
        </div>
    )

    return (
        <div className={styles.shell}>
            <Sidebar />

            <div className={styles.main}>
                <div className={styles.wrapper}>
                    <div className={styles.card}>

                        <div className={styles.header}>
                            <div>
                                <p className={styles.eyebrow}>Payments</p>
                                <h2 className={styles.title}>Payment Method</h2>
                                <p className={styles.subtitle}>
                                    Manage your Stripe payout account and keep your payment setup up to date.
                                </p>
                            </div>

                            <div
                                className={`${styles.badge} ${
                                    isComplete ? styles.badgeSuccess : styles.badgeError
                                }`}
                            >
                                <span className={styles.badgeDot}></span>
                                {isComplete ? "Setup Complete" : "Not Setup"}
                            </div>
                        </div>

                        <div className={styles.body}>
                            <div className={styles.infoBox}>
                                <p className={styles.label}>
                                    Account status
                                </p>
                                <p>acc_id: {stripeAccount?.stripeAccountId}</p>

                                <p className={styles.statusText}>
                                    {isComplete
                                        ? "Your Stripe payout account is active and ready to receive payouts."
                                        : "You still need to finish Stripe onboarding before payouts can be sent."}
                                </p>
                            </div>

                            {/* BUTTONS ONLY IF NOT COMPLETE */}
                            {!isComplete && (
                                stripeAccount !== null && !stripeAccount?.payoutsEnabled ? (
                                    <button
                                        className={styles.setupBtn}
                                        onClick={handleOnBoardingLink}
                                    >
                                        Finish Stripe onboarding
                                    </button>
                                ) : (
                                    <button
                                        className={styles.setupBtn}
                                        onClick={handleCreateStripeAccount}
                                    >
                                        Create payout account
                                    </button>
                                )
                            )}

                            {/* SUCCESS MESSAGE */}
                            {isComplete && (
                                <div className={styles.successBox}>
                                    <p className={styles.successMsg}>
                                        Your Stripe payout account is ready.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        
            <FlashMessage
                show={message.visible}
                type={message.type}
                message={message.msg}
                onClose={() => setMessage({...message, visible: false})}
            />
            <LoadingModal open={loading} />
        </div>
    );
}