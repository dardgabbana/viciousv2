"use client";

import styles from "./ProductInspectionOverlay.module.css";

interface ProductInspectionOverlayProps {
  active: boolean;
  details: string[];
  name: string;
  price: string;
  type: string;
  onViewItem: () => void;
}

export default function ProductInspectionOverlay({
  active,
  details,
  name,
  price,
  type,
  onViewItem,
}: ProductInspectionOverlayProps) {
  const primaryDetail = details[0] || "ARCHIVE GARMENT";
  const secondaryDetail = details[1];

  return (
    <>
      <div className={styles.desktop} aria-hidden="true">
        <span className={styles.scanLine} />

        <svg className={styles.connectors} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className={styles.line} d="M48 38 L27 24 L6 24" pathLength="1" />
          <circle className={styles.anchor} cx="48" cy="38" r="1.1" />
          <path className={`${styles.line} ${styles.lineDelayed}`} d="M54 62 L74 76 L95 76" pathLength="1" />
          <circle className={styles.anchor} cx="54" cy="62" r="1.1" />
        </svg>

        <div className={`${styles.label} ${styles.labelPrimary}`}>
          <span className={styles.kicker}>ARCHIVE RECORD</span>
          <strong>{name}</strong>
          <span>{price}</span>
        </div>

        <div className={`${styles.label} ${styles.labelSecondary}`}>
          <span className={styles.kicker}>TYPE</span>
          <strong>{type}</strong>
          <span className={styles.kicker}>DETAIL</span>
          <span>{primaryDetail}</span>
          {secondaryDetail && <span>{secondaryDetail}</span>}
        </div>
      </div>

      <div
        className={`${styles.mobile} ${active ? styles.mobileActive : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.mobileKicker}>GARMENT INSPECTION</span>
        <div className={styles.mobileHeading}>
          <strong>{name}</strong>
          <span>{price}</span>
        </div>

        <div className={styles.mobileMeta}>
          <div>
            <span>TYPE</span>
            <strong>{type}</strong>
          </div>
          <div>
            <span>DETAILS</span>
            {details.map((detail) => (
              <strong key={detail}>+ {detail}</strong>
            ))}
          </div>
        </div>

        <button type="button" className={styles.viewButton} onClick={onViewItem}>
          VIEW ITEM
        </button>
      </div>
    </>
  );
}
