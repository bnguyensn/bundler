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

const imgCatLarge = imgGenerator(catLarge);
const imgCatSmall = imgGenerator(catSmall);

document.body.appendChild(brGenerator());
document.body.appendChild(imgCatLarge);
document.body.appendChild(brGenerator());
document.body.appendChild(imgCatSmall);

if (module.hot) {
  module.hot.accept('./index.js', () => {
    console.log('Webpack Hot Module Replacement updated successfully!');
  });
}
