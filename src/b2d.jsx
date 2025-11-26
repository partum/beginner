import React, { useState } from 'react';

function B2D() {
  const [binary, setBinary] = useState(10)
  const [decimal, setDecimal] = useState(2)
  let regex = /^[0-1]{1,}$/;

  const handleSubmit = (e) => {
    e.preventDefault(); //this prevents the page from reloading on submit
    if(regex.test(binary)){
    binaryToDecimal(binary);}
    else{
      alert("Please enter a binary number");
      setDecimal("-");
    }
  }

  const handleChange = (e) => {
    setBinary(e.target.value)
  }

  function binaryToDecimal(bin) {
    let dec = 0;
    let len = bin.length;
    let i = 0;
    let exp = len-1;
    while(i < len) {
      dec = bin[i]*(2**exp)+dec;
      i++;
      exp--;
    }
    setDecimal(dec);
  }

  return <>
    <h2>Binary to Decimal Converter</h2>
    <form onSubmit={handleSubmit}>
      <input 
        type="number"
        value={binary}
        onChange={handleChange}
        placeholder="Enter a binary number"
      />
      <button type="submit">Convert</button>
    </form>
    <p>Decimal: {decimal}</p>
  </>
}

export default B2D
