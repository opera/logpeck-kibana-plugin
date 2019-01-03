var fs = require("fs");
var querystring = require('querystring');
exports.read = read;
function read(path) {
  if (fs.existsSync(path)) {
      var data = fs.readFileSync(path);
      return {"data":data.toString(), "err":null};
  } else {
      console.log("create host-name.txt");
      fs.createWriteStream(path);
      return {"data":"", "err":null};
  }
}

exports.write = write;
function write(path, value) {
  if (!fs.existsSync(path)) {
      fs.createWriteStream(path);
  }
  try {
    fs.writeFileSync(path, value, {flag: 'w'});
    return {"data":null, "err":null};
  } catch(e) {
    return {"data":null, "err":e.toString()};
  }
}

exports.writeSet = writeSet;
function writeSet(path, value) {
  var result = read(path);
  if (result.err) {
    return {"data":null, "err":err};
  }
  var arr =  new Array();
  if (result.data != "") {
    arr =result.data.split(",");
  }
  for (var i in arr) {
    if (arr[i] == value) {
      return {"data":null, "err":"host has exist"};
    }
  }
  arr.push(value);
  return write(path, arr.toString());
}

exports.removeSet = removeSet;
function removeSet(path, value) {
  var result = read(path);
  if (result.err) {
    return result;
  }
  var arr =  new Array();
  if (result.data != "") {
    arr =result.data.split(",");
  }
  try {
    arr.remove(value);
    return {"data":null, "err":null};
  } catch(e) {
    return {"data":null, "err":e.toString()};
  }
}
