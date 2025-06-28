import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logger from '../middleware/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortLinks')) || [];

    const match = stored.find(entry => {
      try {
        const url = new URL(entry.shortUrl);
        return url.pathname.slice(1) === shortcode;
      } catch {
        return false;
      }
    });

    if (match) {
      const expiryTime = new Date(match.expiry);
      const now = new Date();

      if (now > expiryTime) {
        logger("Expired link accessed", { shortcode });
        navigate('/link-expired'); // Custom expired page
        return;
      }

      logger("Redirecting to long URL", { shortcode, target: match.longUrl });

      // Track click
      const clickLog = {
        timestamp: new Date().toLocaleString(),
        shortcode,
        referrer: document.referrer || 'direct',
        geo: 'IN' // Stub value; can use IP API later
      };

      const allClicks = JSON.parse(localStorage.getItem('clicks')) || [];
      allClicks.push(clickLog);
      localStorage.setItem('clicks', JSON.stringify(allClicks));

      // Perform redirect
      window.location.href = match.longUrl;
    } else {
      logger("Invalid shortcode accessed", { shortcode });
      alert("❌ Invalid or expired short URL");
      navigate('/');
    }
  }, [shortcode, navigate]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
