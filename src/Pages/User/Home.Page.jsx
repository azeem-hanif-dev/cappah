import React, { useState, useEffect } from "react";
import HeroSection from "../../Components/User/Home/Hero.component";
import Our_Division from "../../Components/User/Home/Our_Division.component";
import Choose_Us from "../../Components/User/Home/Choose_Us.component";
import Empowering from "../../Components/User/Home/Empowering.component";
import Speciality from "../../Components/User/Home/Speciality.component";
import Allies from "../../Components/User/Home/Allies.component";
import Categories from "../../Components/User/Home/Categories.component";
import Home_Title_Description from "../../Components/User/Home/Title_Description.component";

const Home = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [splashClass, setSplashClass] = useState("splash-hidden");

  useEffect(() => {
    // Check if the splash screen has been shown
    const splashShown = sessionStorage.getItem("splashShown");

    if (!splashShown) {
      setShowSplash(true);
      setSplashClass("splash-visible");

      // Start slide-up animation
      const slideTimer = setTimeout(() => {
        setSplashClass("splash-hidden");
      }, 1000);

      // Remove splash screen completely and store session state
      const removeTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashShown", "true");
      }, 1800);

      return () => {
        clearTimeout(slideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  return (
    <>
      <div>
        {showSplash && (
          <div className={`splash-container ${splashClass}`}>
            <img
              src="/common/SplashPhone.svg"
              alt="Mobile Splash Screen"
              className="splash-image block lg:hidden" // Show on small screens
            />
            <img
              src="/common/Splash.svg"
              alt="Desktop Splash Screen"
              className="splash-image hidden lg:block" // Show on large screens
            />
          </div>
        )}
        <HeroSection />
        <Home_Title_Description
          title={"Explore Cappah Products"}
          description={
            "Cappah offers a wide range of high-quality cleaning tools and equipment designed for both professional and domestic use. From textiles and plastics to metal-based solutions, our products are built for durability, effectiveness, and eco-friendly performance. Whether it's floor care, glass cleaning, or safety essentials, Cappah delivers reliable solutions tailored to meet the demands of every cleaning environment."
          }
        />
        <Categories />
        <Our_Division />
        <Speciality />
        <Allies />
        <Empowering />
        <Choose_Us />
      </div>
    </>
  );
};

export default Home;
