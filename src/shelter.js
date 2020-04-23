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

const changeShelterNeedStatus = (req, res) => {
  const { id, status } = req.body

  if (id && status != undefined) {
      dbManager.changeShelterNeedStatus(id, status, (err, data) => {
          if (err) {
              console.log(err)
              response.fail(err, res)
          } else {
              response.ok(data, res)
          }
      });
  } else {
      response.fail('id or status not supplied', res)
  }
}

const changeShelterConditionStatus = (req, res) => {
  const { id, status } = req.body;

  if (id && status != undefined) {
      dbManager.changeShelterConditionStatus(id, status, (err, data) => {
          if (err) {
              console.log(err)
              response.fail(err, res)
          } else {
              response.ok(data, res)
          }
      });
  } else {
      response.fail('id or status not supplied', res)
  }
}

module.exports = {
  getShelter: getShelter,
  getShelterVictimList: getShelterVictimList,
  getShelterStock: getShelterStock,
  getShelterConditionHistory: getShelterConditionHistory,
  getShelterNeedHistory: getShelterNeedHistory,
  changeShelterNeedStatus: changeShelterNeedStatus,
  changeShelterConditionStatus: changeShelterConditionStatus
}