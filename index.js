const { Transform } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const fs = require('fs');
const { updateElapsedTime, setOutputObject, objectToString } = require('./lib/helpers');

let totalBytes = 0;
let totalLines = 0;
let startTime = null;

const initialStream = new Transform({ //transform is also duplex stream
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    if (startTime === null) startTime = process.hrtime();

    this._rest = this._rest && this._rest.length
      ? Buffer.concat([this._rest, chunk])
      : chunk;

    let index;

    // consume line by line of text file
    while ((index = this._rest.indexOf('\n')) !== -1) {
      if (index < this._rest.length) index = this._rest.indexOf('\n') || this._rest.length;
      const line = this._rest.slice(0, ++index); // line being evaluated
      this._rest = this._rest.slice(index); // rest of the text file

      totalLines += 1;
      totalBytes += line.length;

      // Transform the data chunk into output object
      let data = setOutputObject(totalLines, totalBytes);
      updateElapsedTime(data, startTime); // set the elapsed time
      this.push(data); //push data chunk into stream
    }

    callback();
  },

  // set the remaining data into output object
  flush(callback) {
    if (this._rest && this._rest.length) {
      let data = setOutputObject(totalLines += 1, totalBytes += this._rest.length);

      callback(null, updateElapsedTime(data, startTime));
    }
  }
});

const reportStream = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {

    // To do: to calculate bytes/sec: totalBytes / elapsedTime * 1e9
    const data = objectToString(chunk);
    console.log(data);

    callback(null, data);
  }
})

//reportStream.on('data', (chunk) => console.log(chunk));

fs.createReadStream('public/data.txt')
  .pipe(initialStream)
  .pipe(reportStream)