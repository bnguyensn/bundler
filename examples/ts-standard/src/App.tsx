import React from 'react';
import Section from './components/Section';
import catLarge from './img/cat-large.jpg';
import catSmall from './img/cat-small.jpg';
import jsLogoURL, { ReactComponent as JSLogo } from './svg/javascript-logo.svg';

export default function App() {
  return (
    <div className="app">
      <h1>Hello, world!</h1>
      <Section>
        Here's a large cat:
        <img src={catLarge} alt="Large cat" />
      </Section>
      <Section>
        Here's a small cat (this image is inlined using url-loader):
        <img src={catSmall} alt="Small cat" />
      </Section>
      <Section>
        Here's an SVG loaded as a React component:
        <JSLogo />
      </Section>
      <Section>
        Here's an SVG loaded as an embedded img element:
        <img
          src={jsLogoURL}
          alt="JavaScript logo"
          style={{
            width: '100px',
            height: '100px',
          }}
        />
      </Section>
      <Section>
        Here's a component with SVG background loaded using url-loader:
        <div className="has-svg-background" />
      </Section>
    </div>
  );
}
