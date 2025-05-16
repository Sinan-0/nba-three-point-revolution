import React, { useState, useEffect, useRef } from "react";

const ScrollySection = ({ children }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`scrolly-section ${visible ? "visible" : ""}`}
    >
      {children}
    </section>
  );
};

export default ScrollySection;
