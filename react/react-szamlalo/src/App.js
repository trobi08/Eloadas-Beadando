import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Számláló</h1>
      <p>Érték: {count}</p>
      <button onClick={() => setCount(count + 1)}>➕ Növel</button>
      <button onClick={() => setCount(count - 1)}>➖ Csökkent</button>
      <button onClick={() => setCount(0)}>🔄 Visszaállít</button>
    </div>
  );
}

export default App;