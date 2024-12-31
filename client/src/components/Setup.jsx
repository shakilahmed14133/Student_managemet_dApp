import React, { useState, useEffect } from "react";

const App = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px", fontSize: "1.5rem" }}>
      <h3 style={{ color: "green" }}>Current Date and Time:</h3>
      <p>
        <h4 style={{ color: "orange" }}>{dateTime.toLocaleDateString()} </h4>
        <h4 style={{ color: "red" }}> {dateTime.toLocaleTimeString()} </h4>
      </p>
    </div>
  );
};

export default App;
