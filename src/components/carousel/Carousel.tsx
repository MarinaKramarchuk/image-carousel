import React, { useState, useEffect } from "react";
import type { ImageResponse } from "../../types/image";
import "./Carousel.scss";

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    setCurrentIndex((prev) => {
      if (prev >= images.length * 2) {
        return prev - images.length;
      }
      if (prev < images.length) {
        return prev + images.length;
      }
      return prev;
    });
  };

  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  return (
    <div className="carousel-wrapper">
      <div className="carousel-main">
        <button
          className="nav-btn prev"
          aria-label="Previous slide"
          onClick={handlePrev}
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div
            className={`carousel-track ${isTransitioning ? "is-animating" : ""}`}
            onTransitionEnd={handleTransitionEnd}
            style={
              {
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                "--visible-count": visibleCount,
              } as React.CSSProperties
            }
          >
            {tripleImages.map((img, index) => (
              <div
                key={`${img.id}-${index}`}
                className={`image-item ${selectedUrls.includes(img.download_url) ? "is-selected" : ""}`}
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

        <button
          className="nav-btn next"
          aria-label="Next slide"
          onClick={handleNext}
        >
          ›
        </button>
      </div>

      <div className="selected-info">
        <div className="selected-header">
          <h3>Selected Images</h3>
          <span className="count-badge">{selectedUrls.length}</span>
        </div>
        <div className="url-grid">
          {selectedUrls.map((url) => (
            <div key={url} className="url-card">
              {url}
              <img src={url} alt="url" className="thumbnail" />
            </div>
          ))}
          {selectedUrls.length === 0 && (
            <p className="placeholder">
              No images selected. Click on a photo to select it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
