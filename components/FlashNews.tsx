'use client';

import { useState, useEffect } from 'react';

interface FlashItem {
  id: number;
  headline: string;
}

interface FlashNewsProps {
  flashItems: FlashItem[];
}

export default function FlashNews({ flashItems }: FlashNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (flashItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashItems.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [flashItems.length]);

  if (flashItems.length === 0) return null;

  return (
    <section className="flash-news">
      <div className="flash-container">
        <div
          className="flash-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.6s ease-in-out',
          }}
        >
          {flashItems.map((f) => (
            <div key={f.id} className="flash-item">
              <span className="flash-dot" />
              <span className="flash-text">{f.headline}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
