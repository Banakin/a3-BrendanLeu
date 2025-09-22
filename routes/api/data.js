const express = require('express');
const router = express.Router();

// Add API endpoint
const appdata = {
  99: {
    my_ship_name: "Earth Test Ship",
    my_ship_id: "EA_001",
    opposing_ship_name: "Mars Test Ship",
    opposing_ship_id: "MR_001",
    start: "2086-12-30T04:51:00.000Z",
    end: "2087-02-02T06:03:00.000Z",
    minute_length: 49032,
    damage_report: "Left wing in critical condition.",
  },
};

router.get("/data", (req, res) => {
    res.send(JSON.stringify(appdata));
});

router.delete("/data/:battle_id", (req, res) => {
    index = req.params.battle_id;

    object = appdata[index];
    delete appdata[index];

    res.contentType("application/json").send(JSON.stringify(object));
});

router.post("/data", (req, res) => {
  dataObj = req.body;
  
  // Make new object
  storageObj= new Object();
  storageObj.my_ship_name = dataObj.my_ship_name;
  storageObj.my_ship_id = dataObj.my_ship_id;
  storageObj.opposing_ship_name = dataObj.opposing_ship_name;
  storageObj.opposing_ship_id = dataObj.opposing_ship_id;
  storageObj.start = new Date(dataObj.start_year, dataObj.start_month, dataObj.start_day, dataObj.start_hour, dataObj.start_minute);
  storageObj.end = new Date(dataObj.end_year, dataObj.end_month, dataObj.end_day, dataObj.end_hour, dataObj.end_minute);
  storageObj.minute_length = (storageObj.end.getTime() - storageObj.start.getTime()) / (1000 * 60); // In minutes
  storageObj.damage_report = dataObj.damage_report;

  if (dataObj.battle_id == "" || !dataObj.battle_id) {
    dataObj.battle_id = Math.floor(Math.random() * 9999)
  }

  appdata[dataObj.battle_id] = storageObj;

  res.redirect(303, '/');
});

module.exports = router;