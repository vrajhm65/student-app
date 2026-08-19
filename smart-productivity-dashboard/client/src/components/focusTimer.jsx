import { useEffect, useState } from "react";

function FocusTimer({ seconds, setSeconds }) {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, setSeconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <section className="focus-timer">
      <p className="section-label">FOCUS TIMER</p>

      <h2>
        {String(minutes).padStart(2, "0")}:
        {String(remainingSeconds).padStart(2, "0")}
      </h2>

      <button
        type="button"
        onClick={() => setRunning(!running)}
      >
        {running ? "Pause" : "Start"}
      </button>

      <button
        type="button"
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
      >
        Reset
      </button>
    </section>
  );
}

export default FocusTimer;