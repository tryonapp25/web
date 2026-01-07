import { useContext, useMemo, useState } from "react";
import { UserContext } from "../ApiContext/userContext";
import Questionnaire from "../components/questionnaire";
import { PROFILE_QUESTIONS } from "../questions";
import http from "../http/http";
import Header from "../components/header";
import styles from "../styles/profile.module.css";

export default function Profile() {
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [profile, setProfile] = useState(publicUser?.userProfiles || null);

  const displayName = useMemo(() => {
    // adjust based on your user model if you have name fields
    return publicUser?.userName || publicUser?.username || "User";
  }, [publicUser]);

  const initialLetter = (displayName || "U").trim().charAt(0).toUpperCase();

  const UpdateUserProfile = async (nextProfile) => {
    try {
      const res = await http.put(`/user/${publicUser?.uid}/profiles`, nextProfile);
      if (res.data.success) {
        setPublicUser(res.data.data);
        setProfile(res.data.data.userProfiles);
        alert("save userProfile successfully");
      }
    } catch (err) {
      alert(err);
    }
  };

  if (!profile) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <Questionnaire QUESTIONS={PROFILE_QUESTIONS} onSubmit={(d) => UpdateUserProfile(d)} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        {/* Top row */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Profile Summary</h1>
            <p className={styles.subtitle}>
              Your preferences help us personalize recommendations.
            </p>
          </div>

          <button className={styles.editBtn} onClick={() => setProfile(null)}>
            Edit
          </button>
        </div>

        {/* Profile hero */}
        <div className={styles.profileHero}>
          <div className={styles.avatar} aria-hidden="true">
            {initialLetter}
          </div>

          <div className={styles.heroText}>
            <h2 className={styles.name}>{displayName}</h2>
            <p className={styles.meta}>
              {profile.genderStyle || "—"}
              {profile.colorContrast ? ` · ${profile.colorContrast}` : ""}
              {profile.currency ? ` · ${profile.currency}` : ""}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{profile.age ?? "—"}</div>
            <div className={styles.statLabel}>Age</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statValue}>
              {profile.height ? `${profile.height}cm` : "—"}
            </div>
            <div className={styles.statLabel}>Height</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statValue}>
              {profile.weight ? `${profile.weight}kg` : "—"}
            </div>
            <div className={styles.statLabel}>Weight</div>
          </div>
        </div>

        {/* Sections card */}
        <div className={styles.card}>
          <Section title="Basics">
            <Row label="Gender style" value={profile.genderStyle} />
            <Row label="Style confidence" value={profile.styleConfidence} />
            <Row label="Color contrast" value={profile.colorContrast} />
            <Row label="Currency" value={profile.currency} />
          </Section>

          <Divider />

          <Section title="Style Preferences">
            <Row label="Style interests" value={profile.styleInterests} kind="interest" />
            <Row label="Liked colors" value={profile.likedColors} kind="positive" />
            <Row label="Disliked colors" value={profile.dislikedColors} kind="negative" />
          </Section>

          <Divider />

          <Section title="Brands">
            <Row label="Preferred brands" value={profile.preferredBrands} kind="interest" />
            <Row label="Avoid brands" value={profile.avoidBrands} kind="negative" />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}

function Row({ label, value, kind = "neutral" }) {
  const isArray = Array.isArray(value);
  const hasValue = isArray ? value.length > 0 : value !== undefined && value !== null && value !== "";

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>

      <span className={`${styles.value} ${styles[kind]}`}>
        {!hasValue ? (
          <span className={styles.empty}>—</span>
        ) : isArray ? (
          value.map((v, i) => (
            <span className={styles.tag} key={`${v}-${i}`}>
              {v}
            </span>
          ))
        ) : (
          <span className={styles.single}>{value}</span>
        )}
      </span>
    </div>
  );
}
