// - Expands the 26x26 table to 256x256 to encrypt ASCII text
// - Uses the Beaufort cipher's method of symmetric encryption/decryption using the table
// - Uses the Autokey cipher's method of expanding the encryption key with the plaintext
// - Base64 encodes the resulting ASCII ciphertext for easier display
const {Base64} = require('js-base64');

const beaufortAutokey = (key) => {
  const ascii = () => Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)).join('');
  const shift = (text) => text.length <= 1 ? text : text.slice(1) + text[0];
  const rotate = (text, distance) => Array(distance).fill().reduce(result => shift(result), text);
  const base64Encode = (text) => Base64.encode(text);
  const base64Decode = (text) => Base64.decode(text);

  const table = (() => {
    const rows = {};
    const alphabet = ascii();

    return (textChar, keyChar) => {
      const row = rows[textChar] || (rows[textChar] = rotate(alphabet, alphabet.indexOf(textChar)));
      const column = row.indexOf(keyChar);

      return alphabet[column];
    };
  })();

  const encrypt = (plaintext) => {
    const ciphertext = plaintext.split('').reduce((result, textChar, index) => {
      const keyChar = index < key.length ? key[index] : plaintext[index - key.length];

      return result + table(textChar, keyChar);
    }, '');

    return base64Encode(ciphertext);
  };

  const decrypt = (ciphertext) => {
    return base64Decode(ciphertext).split('').reduce((result, textChar, index) => {
      const keyChar = index < key.length ? key[index] : result[index - key.length];

      return result + table(textChar, keyChar);
    }, '');
  };

  return { encrypt, decrypt };
};

// Testing:

const key = 'daniildubov';
const plaintext = 'Dw4pSScnIx8dHTMGCsO3AMO8w7bDrzbDvREABMO8BcOMJsO8w7vDnwEhAsO9CSkNw5vDvzfDssO5w5shCMOyw5sCJQvDjAoBJcORADICw73DkQARAC3DjAfDvcONI8O/w7wpw6/DvcObNAXDugTDlAQAw4w0w7EEw4cjw7sALMO5CsO+w5s3w60KABIKAATDuggAw40AL8Obw6wAw47Dr8O7BsO8BQ0AAxEEw7wUAgXDugXDuQ==';
const cipher = beaufortAutokey(key);
console.log(cipher.decrypt(plaintext))
