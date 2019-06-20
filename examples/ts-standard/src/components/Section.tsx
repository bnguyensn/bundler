import React from 'react';

export default function Section({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  return <div className="app-section">{children}</div>;
}
