import React, { useState, useEffect, useCallback } from "react";
import type { ImageResponse } from "../../types/image";
import "./Carousel.scss";

export const Carousel = ({ images }: { images: ImageResponse }) => {
  const tripleImages = [...images, ...images, ...images];

  const [currentIndex, setCurrentIndex] = useState(images.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  {
    /* Function to handle next slide */
  }
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  {
    /* Function to handle previous slide */
  }
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  {
    /* Function to handle the end of transition, resetting position if needed */
  }
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

  {
    /* Function to toggle image selection */
  }
  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  {
    /* Touch event handlers for swipe navigation */
  }
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNext();
    }
    if (diff < -50) {
      handlePrev();
    }

    setTouchStart(null);
  };

  {
    /* Effect to handle responsive visible count based on window width */
  }
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

  {
    /* Effect to handle keyboard navigation */
  }
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrev, handleNext]);

  return (
    <div className="carousel">
      <div className="carousel__main">
        <button
          className="nav-btn prev"
          aria-label="Previous slide"
          onClick={handlePrev}
        >
          ‹
        </button>

        <div className="carousel__viewport">
          <div
            className={`carousel__track ${isTransitioning ? "is-animating" : ""}`}
            onTransitionEnd={handleTransitionEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
                className={`image ${selectedUrls.includes(img.download_url) ? "is-selected" : ""}`}
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
                onClick={() => toggleSelect(img.download_url)}
              >
                <div className="image__container">
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

      <div className="selected">
        <div className="selected__header">
          <h3>Selected Images</h3>
          <span className="selected__count-badge">{selectedUrls.length}</span>
        </div>
        <div className="selected__grid">
          {selectedUrls.map((url) => (
            <div key={url} className="selected__card">
              {url}
              <img src={url} alt="url" className="selected__thumbnail" />
            </div>
          ))}
          {selectedUrls.length === 0 && (
            <p className="selected__placeholder">
              No images selected. Click on a photo to select it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
