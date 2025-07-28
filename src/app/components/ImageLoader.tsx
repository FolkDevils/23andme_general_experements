'use client';

import { useState, useEffect } from 'react';
import { generateImageData } from './staticImages';

export interface ImageData {
  id: string;
  urls: {
    small: string;
    thumb: string;
  };
  alt_description: string;
}

export const useImageLoader = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use static images for reliable testing
    console.log('Loading static images for DNA helix...');
    
    try {
      // Generate 400 images for full screen coverage
      const staticImages = generateImageData(400);
      setImages(staticImages);
      setError(null);
    } catch (err) {
      console.error('Error loading static images:', err);
      setError('Failed to load static images');
      // Even if there's an error, provide some basic fallback
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, loading, error };
}; 