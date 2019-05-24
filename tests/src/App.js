import React from 'react';
import catLarge from './img/cat-large.jpg';
import catSmall from './img/cat-small.jpg';

export default function App() {
  return (
    <div>
      Hello, world!
      <br />
      Here's a large cat:
      <img src={catLarge} alt="Large cat" />
      Here's a small cat:
      <img src={catSmall} alt="Small cat" />
    </div>
  );
}
