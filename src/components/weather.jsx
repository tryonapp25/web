import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Weather.module.css";
import http from "../http/http";
import { useNavigate } from "react-router-dom";
import StyleLoading from "../styleLoading";

// Fallback coords if user denies location (Berlin)
const FALLBACK = { lat: 52.52, lon: 13.41 };

// ---------- helpers ----------
function mapCondition(weathercode) {
  // Open-Meteo WMO codes → your categories
  // 0 clear
  // 1-3 cloudy
  // 45-48 fog -> cloudy
  // 51-57 drizzle -> rain
  // 61-67 rain -> rain
  // 71-77 snow -> snow
  // 80-82 rain showers -> rain
  // 85-86 snow showers -> snow
  // 95-99 thunderstorm -> mixed
  if (weathercode === 0) return "clear";
  if ([1, 2, 3, 45, 48].includes(weathercode)) return "cloudy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weathercode))
    return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(weathercode)) return "snow";
  if ([95, 96, 99].includes(weathercode)) return "mixed";
  return "mixed";
}

function mapWindBoolean(windspeedKmh) {
  // Simple threshold: >= 10 km/h means "windy"
  return Number(windspeedKmh) >= 10;
}

function conditionLabel(condition) {
  // for UI display (title case)
  switch (condition) {
    case "clear":
      return "Clear";
    case "cloudy":
      return "Cloudy";
    case "rain":
      return "Rain";
    case "snow":
      return "Snow";
    case "windy":
      return "Windy";
    case "mixed":
    default:
      return "Mixed";
  }
}

function bgFor({ condition, isDay }) {
  // Put images in: public/assets/weather/
  // (You can change names/paths)
  const day = isDay ? "day" : "night";
  const map = {
    clear: `url(/assets/weather/clear_${day}.jpg)`,
    cloudy: `url(/assets/weather/cloudy_${day}.jpg)`,
    rain: `url(/assets/weather/rain_${day}.jpg)`,
    snow: `url(/assets/weather/snow_${day}.jpg)`,
    mixed: `url(/assets/weather/mixed_${day}.jpg)`,
    windy: `url(/assets/weather/windy_${day}.jpg)`,
  };
  return map[condition] || `url(/assets/weather/default_${day}.jpg)`;
}

async function reverseGeocode(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&current_weather=true`;


  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reverse geocode error: ${res.status}`);
  const json = await res.json();
  const place = json?.results?.[0];

  return {
    country: place?.country_code ? place.country_code.toUpperCase() : "DK",
    // Prefer city, otherwise name, otherwise "Other"
    city: place?.city || place?.name || "Copenhagen",
  };
}

async function fetchCurrentWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&current_weather=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

// ---------- page ----------
export default function Weather({userData}) {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("locating"); // locating | loading | ready | error
  const [error, setError] = useState("");
  const [profileWeather, setProfileWeather] = useState(null);
  const [isStyling, setStyling] = useState(false);

  // 1) Get coords
  useEffect(() => {
    setStatus("locating");
    setError("");

    if (!navigator.geolocation) {
      setCoords(FALLBACK);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        // fallback if denied/unavailable
        setCoords(FALLBACK);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // 2) When coords, fetch location + weather, then build required data object
  useEffect(() => {
    if (!coords) return;

    (async () => {
      try {
        setStatus("loading");
        setError("");

        const [loc, weatherJson] = await Promise.all([
          reverseGeocode(coords.lat, coords.lon),
          fetchCurrentWeather(coords.lat, coords.lon),
        ]);

        const cw = weatherJson?.current_weather;
        if (!cw) throw new Error("No current_weather in API response");

        const condition = mapCondition(cw.weathercode);
        const windBool = mapWindBoolean(cw.windspeed);

        // If you want to force "windy" condition when it's very windy:
        const finalCondition = windBool && condition === "clear" ? "windy" : condition;

        const result = {
          country: loc.country, // e.g. "DK"
          city: loc.city, // e.g. "Copenhagen"
          temperature_c: Math.round(cw.temperature),
          condition: finalCondition, // "clear" | "cloudy" | "rain" | "snow" | "windy" | "mixed"
          wind: windBool, // boolean
          // extra useful info (optional)
          _meta: {
            lat: coords.lat,
            lon: coords.lon,
            is_day: cw.is_day === 1,
            weathercode: cw.weathercode,
            windspeed_kmh: cw.windspeed,
            time: cw.time,
          },
        };

        setProfileWeather(result);
        setStatus("ready");
      } catch (e) {
        setStatus("error");
        setError(e?.message || "Failed to load weather");
      }
    })();
  }, [coords]);

  const backgroundStyle = useMemo(() => {
    const isDay = profileWeather?._meta?.is_day ?? true;
    const condition = profileWeather?.condition ?? "mixed";
    return { backgroundImage: bgFor({ condition, isDay }) };
  }, [profileWeather]);


  const handleStyling = async () => {
    const finalData = {...profileWeather, ...userData};
    console.log(finalData)
    await SendData(finalData)
  }

  const SendData = async (data) => {
    try{
      data.max_per_item = null

      setStyling(true);
      const res = await http.post(`/user/generate-serpApi-query`,{
        data: JSON.stringify(data)
      });
      if(res.data.success){
        navigate("/recommendations", {
          state: {
            recommendations: res.data.data,
            usage: res.data.usage
          }
        });
      }
    }
    catch(err){
      alert(err)
    }
    finally{
      setStyling(false);
    }
  }

  if(isStyling) return <StyleLoading visible={isStyling}/>

  return (
    <div className={styles.page} style={backgroundStyle}>
      <div className={styles.overlay} />

      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Weather</h1>
            <p className={styles.subtitle}>
              {status === "locating" && "Getting your location…"}
              {status === "loading" && "Loading current conditions…"}
              {status === "ready" && profileWeather && (
                <>
                  {profileWeather.city}, {profileWeather.country} •{" "}
                  {profileWeather._meta.time}
                </>
              )}
              {status === "error" && "Could not load weather"}
            </p>
          </div>

          <button
            className={styles.btn}
            type="button"
            onClick={() => {
              // simple refresh: rerun fetch by resetting coords
              if (coords) setCoords({ ...coords });
            }}
            disabled={status === "locating" || status === "loading"}
          >
            Refresh
          </button>
        </header>

        <main className={styles.card}>
          {status === "error" && <p className={styles.error}>{error}</p>}

          {status !== "error" && !profileWeather && (
            <p className={styles.loadingText}>Preparing your weather profile…</p>
          )}

          {profileWeather && (
            <>
              <div className={styles.topRow}>
                <div className={styles.temp}>
                  {profileWeather.temperature_c}°C
                </div>

                <div className={styles.chips}>
                  <span className={styles.chip}>
                    {conditionLabel(profileWeather.condition)}
                  </span>
                  <span className={styles.chip}>
                    Wind: {profileWeather.wind ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className={styles.grid}>
                <Info label="Country" value={profileWeather.country} />
                <Info label="City" value={profileWeather.city} />
                <Info label="Condition (saved)" value={profileWeather.condition} />
                <Info label="Wind (saved)" value={String(profileWeather.wind)} />
                <Info label="Lat" value={profileWeather._meta.lat.toFixed(4)} />
                <Info label="Lon" value={profileWeather._meta.lon.toFixed(4)} />
                <Info label="WMO code" value={String(profileWeather._meta.weathercode)} />
                <Info label="Wind speed" value={`${profileWeather._meta.windspeed_kmh} km/h`} />
              </div>

              <div className={styles.footerRow}>
                <button className={styles.secondaryBtn} type="button">
                  Edit
                </button>

                {isStyling ?
                  <button
                    className={styles.primaryBtn}
                    type="button"
                  >
                    Styling..
                  </button>
                  :
                  <button
                    className={styles.primaryBtn}
                    type="button"
                    onClick={handleStyling}
                  >
                    Start style
                  </button>  
                }
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className={styles.infoBox}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
}
