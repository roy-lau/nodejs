// npm ref: https://www.npmjs.com/package/sharp
const sharp = require('sharp');

sharp('input.jpeg')
  .rotate()
  .resize(200)
  .toBuffer()
  .then( data => { 
    console.log(data)
   })
  .catch( err => { 
    console.error(err)
   });