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
      if (data.toString() == "") {
        return {"data":JSON.parse("{}"), "err":null};
      }
      return {"data":JSON.parse(data.toString()), "err":null};
    } else {
      console.log("create host-name.txt");
      fs.createWriteStream(pathName);
      return {"data":JSON.parse("{}"), "err":null};
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
    fs.writeFileSync(pathName, JSON.stringify(value), {flag: 'w'});
    return {"data":value, "err":null};
  } catch(e) {
    return {"data":null, "err":e.toString()};
  }
}

exports.keyToList = function (res) {
  if (res.err == null) {
    var new_arr = new Array();
    for (var key in res.data) {
      console.log("key",key);
      new_arr.push(key);
    }
    res.data = new_arr;
    return res;
  }
  return res;
}

exports.readSet = function (pathName, key) {
  var result = read(pathName);
  if (result.err) {
    return result;
  }
  if (result.data.hasOwnProperty(key)) {
    return {"data":result.data[key], "err":null};
  }
  return {"data":null, "err":"Not exist"};
}

exports.readAllKey = function (pathName) {
  var result = read(pathName);
  if (result.err) {
    return result;
  }
  var new_arr = new Array();
  for (var key in result.data) {
    new_arr.push(key);
  }
  result.data = new_arr;
  return result;
}

exports.writeSet = function (pathName, key, value) {
  var result = read(pathName);
  if (result.err) {
    return result;
  }
  for (var i in result.data) {
    if (result.data.hasOwnProperty(key)) {
      return {"data":null, "err":"Add key has exist"};
    }
  }
  result.data[key] = value;
  return write(pathName, result.data);
}

exports.removeSet = function (pathName, key) {
  var result = read(pathName);
  if (result.err) {
    return result;
  }
  if (result.data.hasOwnProperty(key)) {
    delete result.data[key];
  } else {
    return {"data":null, "err":"Delte key not exist"};
  }
  return write(pathName, result.data);
}

exports.resetValue = function (pathName, key, value) {
  var result = read(pathName);
  if (result.err) {
    return result;
  }
  if (result.data.hasOwnProperty(key)) {
    result.data[key] = value;
  } else {
    return {"data":null, "err":"Reset key not exist"};
  }
  return write(pathName, result.data);
}


