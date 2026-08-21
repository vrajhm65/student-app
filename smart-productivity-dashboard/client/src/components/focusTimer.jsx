import { useEffect, useState } from "react";

function FocusTimer({ seconds, setSeconds }) {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved timer state from MongoDB
  useEffect(() => {
    const loadTimer = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/focus/timer"
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load timer:", data);
          return;
        }

        setSeconds(data.seconds);
        setRunning(false);

      } catch (error) {
        console.error("Error loading timer:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTimer();
  }, [setSeconds]);

  // Timer countdown
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, setSeconds]);

  // Save current timer state
  const saveTimer = async (currentSeconds, currentRunning) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/focus/timer",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seconds: currentSeconds,
            running: currentRunning,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Timer save failed:", data);
      }
    } catch (error) {
      console.error("Error saving timer:", error);
    }
  };

  const handleStartPause = async () => {
    if (running) {
      // PAUSE
      setRunning(false);

      await saveTimer(seconds, false);

      // Also save the completed/current focus session
      if (seconds > 0) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/focus",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                duration: seconds,
              }),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            console.error(
              "Focus session save failed:",
              result
            );
          } else {
            console.log(
              "Focus session saved:",
              result
            );
          }
        } catch (error) {
          console.error(
            "Error saving focus session:",
            error
          );
        }
      }

    } else {
      // START
      setRunning(true);

      await saveTimer(seconds, true);
    }
  };

  const handleReset = async () => {
    setRunning(false);
    setSeconds(0);

    await saveTimer(0, false);
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (loading) {
    return (
      <section className="focus-timer">
        <p className="section-label">FOCUS TIMER</p>
        <h2>Loading...</h2>
      </section>
    );
  }

  return (
    <section className="focus-timer">
      <p className="section-label">FOCUS TIMER</p>

      <h2>
        {String(minutes).padStart(2, "0")}:
        {String(remainingSeconds).padStart(2, "0")}
      </h2>

      <button
        type="button"
        onClick={handleStartPause}
      >
        {running ? "Pause" : "Start"}
      </button>

      <button
        type="button"
        onClick={handleReset}
      >
        Reset
      </button>
    </section>
  );
}

export default FocusTimer;