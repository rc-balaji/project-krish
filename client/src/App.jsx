import React from 'react';
import axios from 'axios';

function App() {
  const handleButtonClick = (status) => {
    axios.post('http://localhost:3001/publish', { status })
      .then(response => {
        console.log('Message sent:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <button onClick={() => handleButtonClick('ON')}>ON</button>
      <button onClick={() => handleButtonClick('OFF')}>OFF</button>
    </div>
  );
}

export default App;
