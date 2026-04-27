import { useEffect, useState } from 'react';
import './App.scss'
import { fetchImages } from './services/imageService';
import type { ImageResponse } from './types/image';
import { Carousel } from './components/carousel';
import Loader from './components/Loader/Loader';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [images, setImages] = useState<ImageResponse>([]);

useEffect(() => {
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await fetchImages();
      setImages(fetchedImages);
    } catch (error) {
      setErrorMessage("Could not load images. Please try again later.");
      console.error("Error in component while loading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  loadImages();
}, []);

  return (
      <section>
        <h1>Image Carousel</h1>
        {isLoading && <Loader />}
        {errorMessage && <p>{errorMessage}</p>}
        {!isLoading && !errorMessage && (
          <Carousel images={images} />
      )}
      </section> 
  )
}

export default App
