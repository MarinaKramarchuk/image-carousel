import React, { useState, useEffect } from 'react';
import type { ImageResponse } from '../../types/image';
import './Carousel.scss';

export const Carousel = ({ images }: { images: ImageResponse }) => {
  const tripleImages = [...images, ...images, ...images];
  
  const [currentIndex, setCurrentIndex] = useState(images.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) setVisibleCount(5);
      else if (width >= 768) setVisibleCount(3);
      else setVisibleCount(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Миттєвий "стрибок" (телепортація) після завершення анімації
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    if (currentIndex >= images.length * 2) {
      // Якщо зайшли в третій масив — стрибаємо в аналогічну точку другого
      setCurrentIndex(currentIndex - images.length);
    } else if (currentIndex < images.length) {
      // Якщо вийшли в перший масив — стрибаємо вперед у другий
      setCurrentIndex(currentIndex + images.length);
    }
  };

  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  return (
    <div className="carousel-wrapper">
      <div className="carousel-main">
        <button className="nav-btn prev" onClick={handlePrev}>‹</button>
        
        <div className="carousel-viewport">
          <div 
            className={`carousel-track ${isTransitioning ? 'is-animating' : ''}`}
            onTransitionEnd={handleTransitionEnd}
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              '--visible-count': visibleCount 
            } as React.CSSProperties}
          >
            {tripleImages.map((img, idx) => (
              <div
                key={`${img.id}-${idx}`}
                className={`image-item ${selectedUrls.includes(img.download_url) ? 'is-selected' : ''}`}
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
                onClick={() => toggleSelect(img.download_url)}
              >
                <div className="image-container">
                  <img src={img.download_url} alt={img.author} loading="lazy" />
                  <div className="selection-overlay">✓</div>
                  <div className="author-badge">{img.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="nav-btn next" onClick={handleNext}>›</button>
      </div>

      {/* Список вибраних URL */}
      <div className="selected-info">
        <div className="selected-header">
          <h3>Selected Images</h3>
          <span className="count-badge">{selectedUrls.length}</span>
        </div>
        <div className="url-grid">
          {selectedUrls.map((url) => (
            <div key={url} className="url-card">{url}</div>
          ))}
          {selectedUrls.length === 0 && <p className="placeholder">Клікни на фото, щоб вибрати його</p>}
        </div>
      </div>
    </div>
  );
};