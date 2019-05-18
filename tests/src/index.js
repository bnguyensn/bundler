import './styles/global.css';
import catLarge from './img/cat-large.jpg';
import catSmall from './img/cat-small.jpg';

function imgGenerator(imgPath) {
  const img = document.createElement('img');
  img.setAttribute('src', imgPath);

  return img
}

function brGenerator() {
  return document.createElement('br');
}

function textGenerator(text) {
  const div = document.createElement('div');
  div.textContent = text;

  return div
}

const imgCatLarge = imgGenerator(catLarge);
const imgCatSmall = imgGenerator(catSmall);

document.body.appendChild(brGenerator());
document.body.appendChild(imgCatLarge);
document.body.appendChild(brGenerator());
document.body.appendChild(imgCatSmall);
document.body.appendChild(brGenerator());
document.body.appendChild(textGenerator('Hello, world!'));

if (module.hot) {
  module.hot.accept('./index.js', () => {
    console.log('Webpack Hot Module Replacement updated successfully!');
  });
}
