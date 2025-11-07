import { useState, useEffect, useRef } from "react";

const Story_Card = ({ number, postfix, data }) => {
  const [displayNumber, setDisplayNumber] = useState(number);
  const [isInView, setIsInView] = useState(false); // State to track visibility
  const cardRef = useRef(null); // Reference to the Story_Card component

  useEffect(() => {
    const end = parseInt(number.toString().replace(/\D/g, "")); // Extract numeric part of the `number`

    // Intersection Observer setup
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true); // Start animation when in view
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the card is in view
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return; // If the component isn't in view, do nothing

    // Start animation when the card is in view
    const end = parseInt(number.toString().replace(/\D/g, "")); // Extract numeric part of the `number`

    if (end > 1900) {
      let start = 2000;
      const duration = 5000;
      const stepTime = Math.abs(Math.floor(duration / (start - end)));

      const timer = setInterval(() => {
        start -= 1;
        if (start < end) {
          clearInterval(timer);
          setDisplayNumber(number);
        } else {
          setDisplayNumber(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      let start = 0;
      const duration = 5000;
      const stepTime = Math.abs(Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        if (start >= end) {
          clearInterval(timer);
          setDisplayNumber(number);
        } else {
          setDisplayNumber(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, number]); // Depend on `isInView` state

  return (
    <div
      ref={cardRef}
      className="flex flex-col justify-center items-center bg-seagreen h-56 w-56 text-white space-y-2 py-4 px-4"
    >
      <h2 className="text-5xl font-semibold uppercase">
        {typeof displayNumber === "number" ? displayNumber : displayNumber + ""}
        {postfix}
      </h2>
      <p className="text-center uppercase ">{data}</p>
    </div>
  );
};

export default Story_Card;
