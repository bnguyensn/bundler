import React from 'react';
import catLarge from './img/cat-large.jpg';
import catSmall from './img/cat-small.jpg';
import jsLogoURL, {ReactComponent as JSLogo} from './svg/javascript-logo.svg';

export default function App() {
  return (
    <div>
      Hello, world!
      <br />
      Here's a large cat:
      <img src={catLarge} alt="Large cat" />
      Here's a small cat:
      <img src={catSmall} alt="Small cat" />
      Here's an SVG loaded as a React component:
      <JSLogo />
      Here's an SVG loaded as an embedded img element:
      <img
        src={jsLogoURL}
        alt="JavaScript logo"
        style={{
          width: '100px',
          height: '100px',
        }}
      />
      Here's a component with SVG background loaded using url-loader:
      <div className="has-svg-background" />
    </div>
  );
}
