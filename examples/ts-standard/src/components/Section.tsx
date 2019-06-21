import React from 'react';
import styles from '../styles/section.module.css';

export default function Section({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  return <div className={styles.section}>{children}</div>;
}
