'use strict';

var response = require('../res');
var dbManager = require('../controller');

const getShelter = (req, res) => {
    const { id } = req.query;

    if (id) {
        dbManager.getShelter(id, (err, data) => {
            if (err) {
                console.log(err)
                response.fail(err, res)
            } else {
                response.ok(data, res)
            }
        });
    } else {
        response.fail('id not supplied', res)
    }
}

const getShelterVictimList = (req, res) => {
  const { id } = req.query;

  if (id) {
      dbManager.getShelterVictimList(id, (err, data) => {
          if (err) {
              console.log(err)
              response.fail(err, res)
          } else {
              response.ok(data, res)
          }
      });
  } else {
      response.fail('id not supplied', res)
  }
}

const getShelterStock = (req, res) => {
  const { id } = req.query;

  if (id) {
      dbManager.getShelterStock(id, (err, data) => {
          if (err) {
              console.log(err)
              response.fail(err, res)
          } else {
              response.ok(data, res)
          }
      });
  } else {
      response.fail('id not supplied', res)
  }
}

const getShelterConditionHistory = (req, res) => {
  const { id } = req.query;

  if (id) {
      dbManager.getShelterConditionHistory(id, (err, data) => {
          if (err) {
              console.log(err)
              response.fail(err, res)
          } else {
              response.ok(data, res)
          }
      });
  } else {
      response.fail('id not supplied', res)
  }
}

const getShelterNeedHistory = (req, res) => {
  const { id } = req.query;

  if (id) {
      dbManager.getShelterNeedHistory(id, (err, data) => {
          if (err) {
              console.log(err)
              response.fail(err, res)
          } else {
              response.ok(data, res)
          }
      });
  } else {
      response.fail('id not supplied', res)
  }
}

module.exports = {
  getShelter: getShelter,
  getShelterVictimList: getShelterVictimList,
  getShelterStock: getShelterStock,
  getShelterConditionHistory: getShelterConditionHistory,
  getShelterNeedHistory: getShelterNeedHistory
}