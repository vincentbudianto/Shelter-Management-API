'use strict';

var response = require('../res');
var dbManager = require('../controller');

// async function getAllRecommendation (req, res) {
//     let victimData = {};
//     let stockData = {};

//     try {
//         await new Promise(async (resolve, reject) => {
//             await new Promise((resolve, reject) => {
//                 dbManager.getAllVictim((err, data) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                     } else {
//                         victimData = data;
//                         resolve();
//                     }
//                 });
//             });
    
//             let getActiveConditionHistory =  victimData.map((obj, i) => {
//                 return new Promise((resolve, reject) => {
//                     dbManager.getVictimActiveConditionHistory(obj.VictimID, (err, dataHistory) => {
//                         if (err) {
//                             console.log(err);
//                             reject(err);
//                         } else {
//                             victimData[i].conditions = dataHistory;
//                             resolve();
//                         }
//                     });
//                 });
//             });
    
//             let getActiveNeedHistory =  victimData.map((obj, i) => {
//                 return new Promise((resolve, reject) => {
//                     dbManager.getVictimActiveNeedHistory(obj.VictimID, (err, dataHistory) => {
//                         if (err) {
//                             console.log(err);
//                             reject(err);
//                         } else {
//                             victimData[i].needs = dataHistory;
//                             resolve();
//                         }
//                     });
//                 });
//             });
    
//             Promise.all([...getActiveConditionHistory, ...getActiveNeedHistory]).then(() => {
//                 resolve();
//             }, (err) => {
//                 reject(err);
//             })
//         });
    
//         await new Promise(async (resolve, reject) => {
//             dbManager.getAllShelterWithStock((err, data) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                 } else {
//                     stockData = data;
//                     resolve();
//                 }
//             });
//         });

//         response.ok({victimData, stockData}, res);
//     } catch (err) {
//         response.fail(err, res);
//     }
// }

// {
//     victim_id: '3',
//     nik: '9876543598765435',
//     name: 'Sunny',
//     status: 'Keluarga banyak di Cisitu Lama',
//     current_shelter: 'Cisitu Indah',
//     current_shelter_id: 1,
//     recommended_shelter: 'Cisitu Lama',
//     recommended_shelter_id: 6,
//     urgency: 0
// }

const getAllRecommendation = (req, res) => {
    dbManager.getAllRecommendation((err, data) => {
        if (err) {
            console.log(err)
            response.fail(err, res)
        } else {
            response.ok(data, res)
        }
    });
}

module.exports = {
    getAllRecommendation: getAllRecommendation
}