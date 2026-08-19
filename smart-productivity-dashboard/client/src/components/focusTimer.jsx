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
    onClick={async () => {
        if (running) {
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
                    return;
                }

                console.log(
                    "Focus session saved:",
                    result
                );

            } catch (error) {
                console.error(
                    "Error saving focus session:",
                    error
                );
            }
        }

        setRunning(!running);
    }}
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