import React, { useState, useEffect } from 'react';
function Count() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

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
    let millisecondsInADay = 1000 * 60 * 60 * 24;
    setDays (Math.floor(diff / millisecondsInADay));
    setHours (Math.floor((diff % millisecondsInADay) / (1000 * 60 * 60)));
    setMinutes (Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  }


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
        {submitted?<p>{name} is in {days} days, {hours} hours, and {minutes} minutes</p>:""}
        {/* <p>{time} days, {time} hours, and {time} minutes until {name}</p> */}
    </div>
}
export default Count;