import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as fpixel from '@/lib/fpixel';

export const FacebookPixel = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Pixel on first mount
    fpixel.init();
  }, []);

  useEffect(() => {
    // Track PageView on route change (SPA support)
    fpixel.pageview();
  }, [location.pathname, location.search]);

  return null;
};
