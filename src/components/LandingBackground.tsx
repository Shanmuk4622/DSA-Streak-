'use client';

import Lottie from 'lottie-react';
import animationData from '../public/streak-loader.json';

const LandingBackground = () => {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
      <Lottie animationData={animationData} />
    </div>
  );
};

export default LandingBackground;