const { Transform } = require('stream');
const readline = require('readline'); // reads one line at a time

let totalBytes = 0;
let totalLines = 0;
let startTime = null;

const updateElapsedTime = (data, time) => {
  let diff = process.hrtime(time);
  data.elapsedTime = diff[0];

  return data;
}

const initialStream = new Transform({ //transform is also duplex stream
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    if (startTime === null) startTime = process.hrtime();

    // Transform the chunk into output object
    const data = {
      elapsedTime: null,
      length: totalBytes += chunk.length,
      lines: totalLines++
    }

    // Push the object onto the readable queue.
    callback(null, updateElapsedTime(data, startTime));
  }
});

const reportStream = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // code hurr
  }

})

process.stdin
  .pipe(initialStream)
