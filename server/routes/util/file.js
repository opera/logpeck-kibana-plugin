var fs = require("fs");
var querystring = require('querystring');
var path = require('path');

exports.createPath = function(pathName) {
  try {
    if (!fs.existsSync(pathName)) {
      var res = exports.createPath(path.dirname(pathName));
      if (res.err) {
        return res;
      }
      fs.mkdirSync(pathName)
    }
    return {"data":null, "err":null};
  } catch(e) {
    return {"data":null, "err":e.toString()};
  }
}

exports.read = read;
function read(pathName) {
  try {
    var res = exports.createPath(path.dirname(pathName));
    if (res.err) {
      return res;
    }
    if (fs.existsSync(pathName)) {
      var data = fs.readFileSync(pathName);
      return {"data":data.toString(), "err":null};
    } else {
      console.log("create host-name.txt");
      fs.createWriteStream(pathName);
      return {"data":"", "err":null};
    }
  } catch(e) {
    return {"data":null, "err":e.toString()};
  }
}

exports.write = write;
function write(pathName, value) {
  try {
    var res = exports.createPath(path.dirname(pathName));
    if (res.err) {
      return res;
    }
    if (!fs.existsSync(pathName)) {
      fs.createWriteStream(pathName);
    }
    fs.writeFileSync(pathName, value.toString(), {flag: 'w'});
    return {"data":null, "err":null};
  } catch(e) {
    return {"data":null, "err":e.toString()};
  }
}

exports.writeSet = function (pathName, value) {
  var result = read(pathName);
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
  return write(pathName, arr);
}

exports.removeSet = function (pathName, value) {
  var result = read(pathName);
  if (result.err) {
    return result;
  }
  var arr =  new Array();
  if (result.data != "") {
    arr = result.data.split(",");
  }
  var new_arr = new Array();
  for (var i in arr) {
    if (arr[i] != value) {
      new_arr.push(arr[i]);
    }
  }
  var res = write(pathName, new_arr);
  res.data = new_arr;
  return res;
}

exports.getPath = function (pathName, filename) {
  return pathName+filename+".txt";
}

