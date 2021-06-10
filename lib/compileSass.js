'use strict';

const path  = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sass = require('node-sass');
const config = require('../config');

module.exports = {
  compileSass,
  compileSassProduction,
  compileSassApp
};

function compileSass(sassFile) {
  const sassOptions = {
    file: sassFile
  };

  if (config.settting.env !== 'production' || config.settting.env !== 'prod') {
    sassOptions.sourceMapEmbed = true;
  }
  else {
    sassOptions.outputStyle = 'compressed';
  }

  return new Promise((resolve, reject) => {
    sass.render(sassOptions, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result.css.toString());
    });
  }).catch(console.error);
}

function compileSassProduction(sassFile) {
  const fullSassPath = path.join(__dirname, '../views/assets/scss/', sassFile);
  const cssFile = sassFile.replace('.scss', '.css');
  const cssPath = path.join(__dirname, '../public/css');
  const fullCssPath = path.join(cssPath, cssFile);

  return compileSass(fullSassPath).then(css => {
    return new Promise((resolve, reject) => {
      mkdirp(cssPath, error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        fs.writeFile(fullCssPath, css, error => {
          if (error) {
            return reject(error);
          }

          resolve(cssFile);
        });
      });
    }).catch(console.error);
  });
}

function compileSassApp() {
  return compileSassProduction('app.scss').then(() => {
    console.log('Created app.css');
  }).catch(console.error);
}