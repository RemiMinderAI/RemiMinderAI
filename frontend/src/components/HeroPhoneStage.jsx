import React from "react";
import styles from "./HeroPhoneStage.module.css";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ClipboardList,
  Home,
  Share2,
  Sparkles,
  User,
  Users,
} from "lucide-react";

function SpanishVisitSummary() {
  return (
    <div className={styles.summaryScreen} lang="es">
      <header className={styles.summaryHeader}>
        <div className={styles.summaryTopRow}>
          <span className={styles.summaryIconBtn} aria-hidden="true">
            <ArrowLeft size={14} strokeWidth={2.4} />
          </span>
          <p className={styles.summaryKicker}>Resumen de visita</p>
          <span className={styles.langChip}>ES</span>
        </div>
        <h3 className={styles.summaryTitle}>Dermatólogo</h3>
        <p className={styles.summaryMeta}>5 ago · 11:00 a. m. · Dr. Reyes</p>
      </header>

      <div className={styles.summaryBody}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHead}>
            <span className={styles.aiBadge}>
              <Sparkles size={11} aria-hidden="true" />
              Resumen con IA
            </span>
            <span className={styles.statusPill}>Listo</span>
          </div>
          <p className={styles.summaryText}>
            El médico revisó el lunar del hombro derecho. No hay signos de
            alarma. Recomendó protector solar SPF 50 a diario y una cita de
            seguimiento en seis meses.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.planLabel}>
            <ClipboardList size={12} aria-hidden="true" />
            Plan de cuidado
          </p>
          <ul className={styles.planList}>
            <li>
              <CheckCircle2 size={12} aria-hidden="true" />
              Recoger la orden de laboratorio
            </li>
            <li>
              <CheckCircle2 size={12} aria-hidden="true" />
              Usar protector solar cada mañana
            </li>
            <li>
              <CheckCircle2 size={12} aria-hidden="true" />
              Próxima visita: febrero
            </li>
          </ul>
        </div>

        <button type="button" className={styles.shareBtn} tabIndex={-1}>
          <Share2 size={12} aria-hidden="true" />
          Compartir con la familia
        </button>
      </div>

      <nav className={styles.summaryNav} aria-hidden="true">
        <span>
          <Home size={13} />
          Inicio
        </span>
        <span className={styles.navActive}>
          <ClipboardList size={13} />
          Visitas
        </span>
        <span>
          <Bell size={13} />
          Resumen
        </span>
        <span>
          <Users size={13} />
          Cuidado
        </span>
        <span>
          <User size={13} />
          Perfil
        </span>
      </nav>
    </div>
  );
}

/**
 * Two overlapping phone mockups: real Home dashboard screenshot + Spanish visit summary.
 */
const HeroPhoneStage = () => {
  return (
    <div className={styles.stage}>
      <div className={styles.ambient} aria-hidden="true" />

      <figure className={`${styles.phone} ${styles.phoneBack}`}>
        <div className={styles.bezel}>
          <div className={styles.notch} aria-hidden="true" />
          <SpanishVisitSummary />
        </div>
        <figcaption className={styles.caption}>Visit Summary · Español</figcaption>
      </figure>

      <figure className={`${styles.phone} ${styles.phoneFront}`}>
        <div className={styles.bezel}>
          <div className={styles.notch} aria-hidden="true" />
          <img
            className={styles.homeShot}
            src="/images/hero-home-dashboard.jpg"
            alt="RemiMinderAI home dashboard with today's schedule, tasks, and care progress"
            width={390}
            height={844}
            loading="eager"
            decoding="async"
          />
        </div>
        <figcaption className={styles.caption}>Home dashboard</figcaption>
      </figure>
    </div>
  );
};

export default HeroPhoneStage;
