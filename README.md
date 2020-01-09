# PBrute
### A dependency-free, feature-rich and modern password strength calculator for NodeJS and the browser
***
![npm badge](https://img.shields.io/npm/v/pbrute.svg)

## Quickstart

```JavaScript
const PBrute = require('pbrute');

const pbrute = new PBrute();
```

```JavaScript
pbrute.calculate('password');

{
  combinations: 208827064576n,
  time: {
    md5: 3788n,
    sha1: 12298n,
    sha256: 27294n,
    bcrypt: 73401428n,
    ntlm: 2684n,
    owasp: 208827064576000n,
    online: 626481193728000n
  },
  optimistic: '3 seconds',
  likely: 'instant',
  pessimistic: 'instant',
  messages: [
    {
      type: 'common',
      text: 'Common password: The top 0 most common password'
    },
    { type: 'length', text: 'Length: Short' },
    {
      type: 'variety',
      text: 'Character variety: Just lowercase letters'
    }
  ]
}
```

```JavaScript
// Get occurances in the Have I Been Pwnd API
await pbrute.haveIBeenPwnd('password');

3730471
```

### Installing

If you're using PBrute in NodeJS or if you have a build pipeline, install PBrute using NPM.
```
npm install pbrute
```

If you're targeting browsers and don't have a build pipeline, build PBrute and select a distribution. The `bare` builds only contain what's necessary to compute everything. No translation is available and messages etc. will be broken. The `translations-only` build contains both the core and all of the translations, for user-friendly messages in various langauges. Lastly, the `full` build contains everyting - core, translations and a password dictionary.

```
git clone https://github.com/AlexGustafsson/pbrute && cd pbrute
npm run build
ls dist
```

```HTML
<script src="./full.min.js"></script>
```

### Running the demo

Simply run `npm start` and navigate to `http://localhost:3000`. This is the same site as is hosted over at `https://pbrute.axgn.se`.

## Documentation

### Support

The library uses `BigInt` which is a new addition to JavaScript. It is not yet supported by all browsers. You can follow the up-to-date support here: https://caniuse.com/#feat=bigint.

### Configuration

```JavaScript
const pbrute = new PBrute({
  // Use Swedish for simplications and messages
  language: 'sv-SE',
  // A custom dictionary for translations (see lib/i18n.json)
  i18n: customDictionary,
  // A sorted list of top passwords
  dictionary: ['password', '123456', 'qwerty'],
  calculationTimes: {
    // Custom time for computing a MD5 hash in milliseconds
    md5: 551200000000n
  }
});
```

### Calculating cracking times

This is the main method provided by PBrute. It calculates cracking time, creates human-readable messages and provides an optimistic, likely and pessimistic crack time.

```JavaScript
pbrute.calculate('password');

{
  combinations: 208827064576n,
  time: {
    md5: 3788n,
    sha1: 12298n,
    sha256: 27294n,
    bcrypt: 73401428n,
    ntlm: 2684n,
    owasp: 208827064576000n,
    online: 626481193728000n
  },
  optimistic: '3 seconds',
  likely: 'instant',
  pessimistic: 'instant',
  messages: [
    {
      type: 'common',
      text: 'Common password: The top 0 most common password'
    },
    { type: 'length', text: 'Length: Short' },
    {
      type: 'variety',
      text: 'Character variety: Just lowercase letters'
    }
  ]
}
```

The `combinations` value is the number of possible combinations within the identified character set - such as lowercase letters.

The `time` object contains the number of milliseconds required to brute force the password. Most keys stand for the algorithm used. The key `owasp` represents the OWASP recommendation that the hashing a password should be tuned to be computed in one second. The `online` key represents the Google recommendation of a response time in under three seconds.

The `optimistic` time is a human-readable time (see `humanizeTime`) for the longest calculated cracking time. The `likely` time is a human-readble most likely crack time (currently using MD5). The `pessimistic` time is the fasest calculation time (currently using NTLM).

The messages array contains human-readable messages. One of the message type is `common` which checks the OWASP top 10 000 passwords found in real leaks. The message type `variety` contains messages about the size of the character classes contained within the password. The `pattern` type mentions patterns found in the password.

### Simplifying time

This function takes a `BigInt` of milliseconds, rounds it to the nearest class such as months and returns a human-readable string.

```JavaScript
pbrute.humanizeTime(6129261512n);

'2 months'
```

### Check the password towards the Have I Been Pwnd API

This function performs a lookup towards https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange using a k-anonymity model. The password is first hashed using SHA-1, then the first five hashed characters are sent to the API which responds with any found hash starting with the sent prefix. The hashes are then compared locally to securely verify if the password has been found in password leaks.

```JavaScript
await pbrute.haveIBeenPwnd('password')

3730471
```

## Contributing

Any contribution is welcome. If you're not able to code it yourself, perhaps someone else is - so post an issue if there's anything on your mind.

### Development

```
# Clone the repository
git clone https://github.com/AlexGustafsson/pbrute

# Enter the directory
cd pbrute

# Install dependencies
npm install

# Follow the conventions enforced
npm run lint
npm run test
npm run coverage
npm run check-duplicate-code
npm run build
npm run integration

# Build for production
npm run build
```

## Disclaimer

_Although the project is very capable, it is not built with production in mind. Therefore there might be complications when trying to use the API for large-scale projects meant for the public. The library was created to easily calculate password strength and as such it might not promote best practices nor be performant._
