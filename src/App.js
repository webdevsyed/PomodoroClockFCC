import "./styles.css";
import { useEffect, useRef, useState } from "react";
import alarm from "./alarm.ogv";

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerType, setTimerType] = useState("Session");
  const [isTimerRunning, setTimerRunning] = useState(false);
  const timer = useRef(null);
  const audioRef = useRef(null);

  // check test 24 and disallow negative by changing timeLeft <0
  // and else handlerest call

  useEffect(() => {
    // if (timeLeft < 0 && sessionLength < 0) {
    //   setTimerType("Session");
    //   audioRef.current.play();
    //   setTimeLeft(breakLength * 60);
    // } else
    if (timeLeft < 0) {
      if (timerType === "Session") {
        setTimerType("Break");
        audioRef.current.play();
        setTimeLeft(breakLength * 60);
      } else if (timerType === "Break") {
        setTimerType("Session");
        audioRef.current.play();
        if (sessionLength > 0) {
          setTimeLeft(sessionLength * 60);
        } else {
          setTimeLeft(breakLength * 60);
        }
      }
    }
  }, [timeLeft]);

  function pad(d) {
    return d < 10 ? "0" + d.toFixed(0) : d.toFixed(0);
  }

  const handleReset = () => {
    // console.log("reset");
    audioRef.current.pause();
    audioRef.current.load();
    clearInterval(timer.current);
    setTimerRunning(false);
    setTimerType("Session");
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
  };

  const handleBreakDecrement = () => {
    // console.log("handleBreakDecrement");
    if (breakLength > 1) setBreakLength(breakLength - 1);
  };

  const handleBreakIncrement = () => {
    // console.log("handleBreakIncrement");
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    // console.log("handleSessionDecrement");
    if (sessionLength > 1) {
      setSessionLength((prevSessionLength) => {
        if (timerType === "Session") {
          setTimeLeft(prevSessionLength * 60 - 60);
        }
        return prevSessionLength - 1;
      });
    }
  };

  const handleSessionIncrement = () => {
    // console.log("handleSessionIncrement");
    if (sessionLength < 60) {
      setSessionLength((prevSessionLength) => {
        if (timerType === "Session") {
          setTimeLeft(prevSessionLength * 60 + 60);
        }
        return prevSessionLength + 1;
      });
    }
  };

  const handleStartStop = () => {
    if (!isTimerRunning) {
      timer.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        console.log(timeLeft);
      }, 1000);
      setTimerRunning(true);
    }

    if (isTimerRunning) {
      // console.log(timer);
      clearInterval(timer.current);
      setTimerRunning(false);
    }
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>

      <div id="lenghts-container">
        <div className="lengths-box">
          <h2 id="break-label">Break Length</h2>
          <div className="counter">
            <button id="break-decrement" onClick={handleBreakDecrement}>
              decrement
            </button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={handleBreakIncrement}>
              increment
            </button>
          </div>
        </div>
        <div className="lengths-box">
          <h2 id="session-label">Session Length</h2>
          <div className="counter">
            <button id="session-decrement" onClick={handleSessionDecrement}>
              decrement
            </button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={handleSessionIncrement}>
              increment
            </button>
          </div>
        </div>
      </div>

      <audio id="beep" src={alarm} ref={audioRef} />

      <div id="timer-container" className={timerType}>
        <h2 id="timer-label" className={timerType}>
          {timerType}
        </h2>
        {/* <p>{timeLeft}</p> */}
        <p id="time-left" className={timerType}>
          {Math.floor(timeLeft / 60) < 10
            ? "0" + Math.floor(timeLeft / 60)
            : Math.floor(timeLeft / 60)}
          :{pad(timeLeft % 60)}
        </p>
      </div>

      <div id="controls">
        <button id="start_stop" onClick={handleStartStop}>
          Start/Stop
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
