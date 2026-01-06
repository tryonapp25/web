import Questionnaire from "../components/questionnaire";
import { STYLE_QUESTIONS } from "../questions";
import { UserContext } from "../ApiContext/userContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Weather from "../components/weather";


export default function PersonalStylish() {
    const navigate = useNavigate();
    const { publicUser, setPublicUser } = useContext(UserContext);
    const [finalResult, setFinalResult] = useState(null);
    const [checkingWeather, setCheckingWeather] = useState(false);

    useEffect(() => {
        if (!publicUser?.userProfiles) {
            navigate("/profile");
        }
    }, [publicUser, navigate]);

    const handleOnSubmit = (data) => {
        const userProfile = publicUser?.userProfiles;
        setFinalResult({...userProfile, ...data});
        setCheckingWeather(true);
    };


    if(checkingWeather) return <Weather userData={finalResult}/>

   
    return (
        <Questionnaire
            title="StylishAI"
            QUESTIONS={STYLE_QUESTIONS}
            onSubmit={handleOnSubmit}
        />
    );
}
