'use strict';

exports.ok = function (data, res) {
  var resp = {
      'status': 200,
      'data': data
  };
  res.json(resp);
  res.end();
};

exports.fail = function (data, res) {
    var resp = {
        'status': 500,
        'data': data
    };
    res.json(resp);
    res.end();
};