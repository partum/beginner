import React, { useState, useEffect } from 'react';
function Count() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    calculateTime();
  }

  const handleName = (e) => {
    setName(e.target.value);
  }

  const handleDate = (e) => {
    setDate(e.target.value);
  }

  const calculateTime = () => {
    //calculate time difference between current date and input date
    let end = new Date(date);
    let start = new Date();
    let diff = end - start; //difference in milliseconds
    diff == 0 ? setDone(true) : setDone(false);
    let millisecondsInADay = 1000 * 60 * 60 * 24;
    setDays(Math.floor(diff / millisecondsInADay));
    setHours(Math.floor((diff % millisecondsInADay) / (1000 * 60 * 60)));
    setMinutes(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    return diff;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTime();
    }, 1000); // Update every 1 second

    // Clean up the interval when the component unmounts or dependencies change
    return () => {
      clearInterval(interval);
    };
  });

  return < div className="project">
    <h2>Countdown Timer</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={handleName}
        placeholder="Event Name"
        required
      />
      <input
        type="date"
        value={date}
        onChange={handleDate}
        placeholder="01-01-2024"
        required
      />
      <button type="submit">Start</button>
    </form>
    {submitted && !done ? <p>{name} is in {days} days, {hours} hours, and {minutes} minutes</p> : ""}
    {done ? <p>It's time for {name}! 🎉</p> : ""}
  </div>
}
export default Count;