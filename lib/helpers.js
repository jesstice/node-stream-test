const updateElapsedTime = (data, time) => {
  let diff = process.hrtime(time);
  data.elapsedTime = diff[0] * 1e9 + diff[1]; // in nanoseconds
  return data;
};

const setOutputObject = (lines, bytes) => {
  let data = {
    elapsedTime: null,
    length: bytes,
    lines: lines
  }
  return data;
};

const objectToString = (sourceObject) => {
  const { elapsedTime, length, lines } = sourceObject;
  const output = `Elapsed time: ${elapsedTime}, Length: ${length}, No of Lines: ${lines}`;
  return output;
}

module.exports = {
  updateElapsedTime,
  setOutputObject,
  objectToString
}