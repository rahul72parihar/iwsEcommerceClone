import React from 'react';

export default function OrderImageSkeleton({ className = '' }) {
  return (
    <div
      className={`order-image-skeleton ${className}`}
      aria-hidden="true"
    />
  );
}

