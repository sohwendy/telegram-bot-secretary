function mergeHashUsingKey(row) {
  const rawPriceJson = this;
  const price = rawPriceJson[row.code];
  return price ? Object.assign(row, { price }) : {};
}

function mergeHashUsingKeyValue(rule) {
  const fullItem = this;
  let item = fullItem.find(i => i.code === rule.code);
  return item ? Object.assign(rule, item) : {};
}

function arrayToHash(values, keys) {
  return values.reduce((json, field, index) => {
    let value;
    if (!keys[index]) {
      return json;
    }

    if (['time', 'date'].includes(keys[index])) {
      value = field;
    } else {
      value = Number.parseFloat(field);
      value = Number.isNaN(value) ? field : value;
    }
    return Object.assign(json, { [keys[index]]: value });
  }, {});
}

// flatten matrix aka 2d array to simple array
function _combineRows(matrix) {
  const rowLength = matrix.length;
  const colLength = matrix[0].length;

  const result = [];
  for (let i = 0; i < rowLength; i ++) {
    for(let j = 0; j < colLength; j ++) {
      result[j] = Object.assign(result[j] || {}, matrix[i][j]);
    }
  }
  return result;
}

// create nested array within row so that each nested can be converted to hash
function _chunkArray(row, size) {
  const result = [];
  for (let i = 0; i < row.length; i += size){
    result.push(row.slice(i, i + size));
  }
  return result;
}

// converts nested array to hash
function _chunkToHash(row, keys) {
  return row.map(group => arrayToHash(group, keys));
}

function matrixToHash(matrix, keys) {
  const size = keys[0].length;
  const chunkMatrix = matrix.map(row => _chunkArray(row, size));
  const hash = chunkMatrix.map((row, i) => _chunkToHash(row, keys[i]));
  const result = _combineRows(hash);
  return result;
}



function hashToMatrix(data, keys, initial = []) {
  return data.reduce((array, hashRow) => {
    const arrayRow = hashToArray(hashRow, keys);
    return array.concat([arrayRow]);
  }, initial);
}

function hashToArray(row, keys) {
  return keys.map(key => row[key]);
}

module.exports = {
  _combineRows,
  _chunkArray,
  _chunkToHash,
  mergeHashUsingKey,
  mergeHashUsingKeyValue,
  arrayToHash,
  matrixToHash,
  hashToArray,
  hashToMatrix
};
