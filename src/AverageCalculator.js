import React, { useState } from 'react';
import axios from 'axios';

const NUMBERS_API = {
  'p': 'http://example.com/primes',
  'f': 'http://example.com/fibonacci',
  'e': 'http://example.com/even',
  'r': 'http://example.com/random'
};

const WINDOW_SIZE = 10;

const AverageCalculator = () => {
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);

  const fetchNumbers = async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const handleGetNumbers = async (numberId) => {
    if (!NUMBERS_API[numberId]) {
      alert('Invalid number ID');
      return;
    }

    const newNumbers = await fetchNumbers(NUMBERS_API[numberId]);
    setNumbers(newNumbers);

    const prevWindow = [...windowCurrState];
    const updatedWindow = [...windowCurrState];

    newNumbers.forEach(number => {
      if (!updatedWindow.includes(number)) {
        if (updatedWindow.length >= WINDOW_SIZE) {
          updatedWindow.shift();
        }
        updatedWindow.push(number);
      }
    });

    setWindowPrevState(prevWindow);
    setWindowCurrState(updatedWindow);

    const newAvg = updatedWindow.reduce((acc, num) => acc + num, 0) / updatedWindow.length;
    setAvg(newAvg.toFixed(2));
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <button onClick={() => handleGetNumbers('e')}>Get Even Numbers</button>
      <button onClick={() => handleGetNumbers('p')}>Get Prime Numbers</button>
      <button onClick={() => handleGetNumbers('f')}>Get Fibonacci Numbers</button>
      <button onClick={() => handleGetNumbers('r')}>Get Random Numbers</button>

      <h2>Response</h2>
      <p><strong>Previous Window State:</strong> {JSON.stringify(windowPrevState)}</p>
      <p><strong>Current Window State:</strong> {JSON.stringify(windowCurrState)}</p>
      <p><strong>Numbers:</strong> {JSON.stringify(numbers)}</p>
      <p><strong>Average:</strong> {avg}</p>
    </div>
  );
};

export default AverageCalculator;
