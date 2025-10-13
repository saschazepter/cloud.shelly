'use strict';

const axios = require('axios');
const fs = require('fs');
const Auth = require('http-auth-client');
const crypto = require('crypto');
const {getIp} = require('./helper/LocalIp');
const { convertIncomingActionEvent } = require('./flow/trigger/ActionEventTrigger');

class Util {

  static deviceConfig = [
    {
      "hostname": ["shellyplug-"],
      "name": "Shelly Plug",
      "gen": "gen1",
      "type": ["SHPLG-1", "SHPLG2-1", "SHPLG-U1"],
      "id": "shellyplug",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyplug.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellyplug-s-"],
      "name": "Shelly Plug S",
      "gen": "gen1",
      "type": ["SHPLG-S"],
      "id": "shellyplug-s",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_temperature", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyplug-s.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellyplus1-", "ShellyPlus1-"],
      "name": "Shelly Plus 1",
      "gen": "gen2",
      "type": ["SNSW-001X16EU", "SNSW-001X15UL"],
      "id": "shellyplus1",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1 test", "nl": "Voltagemeter 1 test"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent"
      ],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyplus1pm-", "ShellyPlus1PM-"],
      "name": "Shelly Plus 1PM",
      "gen": "gen2",
      "type": ["SNSW-001P16EU", "SNSW-001P15UL"],
      "id": "shellyplus1pm",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent"
      ],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyplus2pm-", "ShellyPlus2PM-", "shellyplus2pm-switch-", "ShellyPlus2PM-switch-"],
      "name": "Shelly Plus 2PM",
      "gen": "gen2",
      "type": ["SNSW-002P16EU", "SNSW-102P16EU"],
      "id": "shellyplus2pm-switch",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "actionEvents"],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInputExternal1On", "triggerInputExternal1Off", "triggerTemperature1", "triggerTemperature2", "triggerTemperature3", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyplus2pm-roller-", "ShellyPlus2PM-roller-"],
      "name": "Shelly Plus 2PM Roller Shutter",
      "gen": "gen2",
      "type": ["SNSW-002P16EU", "SNSW-102P16EU"],
      "id": "shellyplus2pm-roller",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power.returned", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplusht-", "ShellyPlusHT-", "shellyhtg3-", "ShellyHTG3-"],
      "name": "Shelly Plus HT",
      "gen": "gen2",
      "type": ["SNSN-0013A", "S3SN-0U12A"],
      "id": "shellyplusht",
      "channels": 1,
      "communication": "websocket",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["measure_temperature", "measure_humidity", "measure_battery", "measure_voltage", "rssi", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["AA", "AA", "AA", "AA"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-plus-ht.svg",
      "extra": {}
    },
    {
      "hostname": ["shellypro1-", "ShellyPro1-"],
      "name": "Shelly Pro 1",
      "gen": "gen2",
      "type": ["SPSW-001XE16EU", "SPSW-101XE16EU", "SPSW-201XE16EU", "SPSW-201XE15UL"],
      "id": "shellypro1",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellypro1pm-", "ShellyPro1PM-"],
      "name": "Shelly Pro 1PM",
      "gen": "gen2",
      "type": ["SPSW-001PE16EU", "SPSW-101PE16EU", "SPSW-201PE16EU", "SPSW-201PE15UL"],
      "id": "shellypro1pm",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellypro2-", "ShellyPro2-", "shellypro2-switch-", "ShellyPro2-switch-"],
      "name": "Shelly Pro 2",
      "gen": "gen2",
      "type": ["SPSW-002XE16EU", "SPSW-102XE16EU", "SPSW-202XE16EU", "SPSW-202XE12UL"],
      "id": "shellypro2-switch",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "measure_temperature", "input_1", "actionEvents"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellypro2-roller-", "ShellyPro2-roller-"],
      "name": "Shelly Pro 2 Roller Shutter",
      "gen": "gen2",
      "type": ["SPSW-002XE16EU", "SPSW-102XE16EU", "SPSW-202XE16EU"],
      "id": "shellypro2-roller",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {}
    },
    {
      "hostname": ["shellypro2pm-", "ShellyPro2PM-", "shellypro2pm-switch-", "ShellyPro2PM-switch-"],
      "name": "Shelly Pro 2PM",
      "gen": "gen2",
      "type": ["SPSW-002PE16EU", "SPSW-102PE16EU", "SPSW-202PE16EU", "SPSW-202PE12UL"],
      "id": "shellypro2pm-switch",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "actionEvents"],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellypro2pm-roller-", "ShellyPro2PM-roller-"],
      "name": "Shelly Pro 2PM Roller Shutter",
      "gen": "gen2",
      "type": ["SPSW-002PE16EU", "SPSW-102PE16EU", "SPSW-202PE16EU"],
      "id": "shellypro2pm-roller",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {}
    },
    {
      "hostname": ["shellypro3-", "ShellyPro3-"],
      "name": "Shelly Pro 3",
      "gen": "gen2",
      "type": ["SPSW-003XE16EU"],
      "id": "shellypro3",
      "channels": 3,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "measure_temperature", "input_1", "actionEvents"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellytrv-"],
      "name": "Shelly TRV",
      "gen": "gen1",
      "type": ["SHTRV-01"],
      "id": "shellytrv",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "thermostat",
      "capabilities_1": ["target_temperature", "measure_temperature", "measure_battery", "valve_position", "valve_mode", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "target_temperature": {"min": 5, "max": 30}
      },
      "energy": {"batteries": ["INTERNAL"]},
      "triggers_1": ["triggerValvePosition"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellytrv.svg",
      "extra": {}
    },
    {
      "hostname": ["shelly1-"],
      "name": "Shelly 1",
      "gen": "gen1",
      "type": ["SHSW-1"],
      "id": "shelly1",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2","nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInputExternal1On", "triggerInputExternal1Off", "triggerTemperature1", "triggerTemperature2", "triggerTemperature3", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush", "longpush"],
      "icon": "../../../assets/icons/shelly1.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shelly1l-"],
      "name": "Shelly 1L",
      "gen": "gen1",
      "type": ["SHSW-L"],
      "id": "shelly1l",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_temperature", "input_1", "input_2", "rssi", "deviceGen1", "actionEvents", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2","nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerInputExternal1On", "triggerInputExternal1Off", "triggerTemperature1", "triggerTemperature2", "triggerTemperature3", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush_1", "longpush_1", "shortpush_2", "longpush_2"],
      "icon": "../../../assets/icons/shelly1l.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shelly1pm-"],
      "name": "Shelly 1PM",
      "gen": "gen1",
      "type": ["SHSW-PM"],
      "id": "shelly1pm",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_temperature", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2","nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInputExternal1On", "triggerInputExternal1Off", "triggerTemperature1", "triggerTemperature2", "triggerTemperature3", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush", "longpush"],
      "icon": "../../../assets/icons/shelly1pm.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellyswitch-", "shelly2-"],
      "name": "Shelly 2",
      "gen": "gen1",
      "type": ["SHSW-21"],
      "id": "shelly2",
      "channels": 2,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": ["onoff", "input_1", "actionEvents"],
      "capability_options": {},
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["shortpush", "longpush"],
      "icon": "../../../assets/icons/shelly2.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellyswitch-roller-", "shelly2-roller-"],
      "name": "Shelly 2 Roller Shutter",
      "gen": "gen1",
      "type": ["SHSW-21"],
      "id": "shelly2-roller",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "input_1", "input_2", "rssi", "deviceGen1", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly2.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyem3-"],
      "name": "Shelly 3EM",
      "gen": "gen1",
      "type": ["SHEM-3"],
      "id": "shelly3em",
      "channels": 3,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power_returned", "meter_power_factor", "measure_current", "measure_voltage", "measure_power.total", "rssi", "deviceGen1"],
      "capabilities_2": ["measure_power", "meter_power", "meter_power_returned", "meter_power_factor", "measure_current", "measure_voltage"],
      "capability_options": {
        "measure_power.total": {"title": {"en": "Total Power", "nl": "Totale Power"}}
      },
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power_returned"},
      "triggers_1": ["triggerMeterPowerFactor", "triggerMeterPowerReturned", "triggerMeasurePowerTotal"],
      "triggers_2": ["triggerMeterPowerFactor", "triggerMeterPowerReturned"],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly3em.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shelly4pro-"],
      "name": "Shelly 4 Pro",
      "gen": "gen1",
      "type": ["SHSW-44"],
      "id": "shelly4pro",
      "channels": 4,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_voltage", "measure_current", "input_1", "rssi", "deviceGen1"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "measure_voltage", "measure_current", "input_1"],
      "capability_options": {},
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power"},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly4pro.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellypro4pm-", "ShellyPro4PM-"],
      "name": "Shelly Pro 4PM",
      "gen": "gen2",
      "type": ["SPSW-004PE16EU", "SPSW-104PE16EU", "SPSW-204PE16EU"],
      "id": "shellypro4pm",
      "channels": 4,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.total_returned", "meter_power_factor", "measure_voltage", "measure_current", "input_1", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "meter_power.total_returned", "meter_power_factor", "measure_voltage", "measure_current", "input_1", "measure_temperature", "actionEvents"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "meter_power.total_returned": {"title": {"en": "Total Energy Returned", "nl": "Totale retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power.total_returned"},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-4pm.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyswitch25-", "shelly25-"],
      "name": "Shelly 2.5",
      "gen": "gen1",
      "type": ["SHSW-25"],
      "id": "shelly25",
      "channels": 2,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_temperature", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "input_1", "actionEvents"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["shortpush", "longpush"],
      "icon": "../../../assets/icons/shelly25.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellyswitch25-roller-", "shelly25-roller-"],
      "name": "Shelly 2.5 Roller Shutter",
      "gen": "gen1",
      "type": ["SHSW-25"],
      "id": "shelly25-roller",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "measure_temperature", "input_1", "input_2", "rssi", "deviceGen1", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly25.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyair-"],
      "name": "Shelly Air",
      "gen": "gen1",
      "type": ["SHAIR-1"],
      "id": "shellyair",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "sensor",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_temperature", "measure_temperature.1", "measure_temperature.2", "measure_temperature.3", "measure_humidity", "input_1", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerTemperature1", "triggerTemperature2", "triggerTemperature3"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyair.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellybulb-"],
      "name": "Shelly Bulb",
      "gen": "gen1",
      "type": ["SHBLB-1"],
      "id": "shellybulb",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_temperature", "light_hue", "light_saturation", "light_mode", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellybulb.svg",
      "extra": {"component": "light", "dim": "brightness", "light_temperature": {"min": 3000, "max": 6500}}
    },
    {
      "hostname": ["shellycolorbulb-"],
      "name": "Shelly Bulb RGBW",
      "gen": "gen1",
      "type": ["SHCB-1", "SHCL-255"],
      "id": "shellycolorbulb",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_temperature", "light_hue", "light_saturation", "light_mode", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "dim": {"opts": {"duration": true }}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellybulb.svg",
      "extra": {"component": "light", "dim": "brightness", "light_temperature": {"min": 3000, "max": 6500}}
    },
    {
      "hostname": ["shellybutton1-", "shellybutton2-"],
      "name": "Shelly Button",
      "gen": "gen1",
      "type": ["SHBTN-1", "SHBTN-2"],
      "id": "shellybutton2",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "button",
      "capabilities_1": ["measure_battery", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["INTERNAL"]},
      "triggers_1": ["triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush", "double_shortpush", "triple_shortpush", "longpush"],
      "icon": "../../../assets/icons/shellybutton1.svg",
      "extra": {}
    },
    {
      "hostname": ["shellydimmer-", "shellydimmer2-"],
      "name": "Shelly Dimmer",
      "gen": "gen1",
      "type": ["SHDM-1", "SHDM-2"],
      "id": "shellydimmer2",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "measure_temperature", "input_1", "input_2", "rssi", "actionEvents", "deviceGen1", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true }}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush_1", "longpush_1", "shortpush_2", "longpush_2"],
      "icon": "../../../assets/icons/shellydimmer.svg",
      "extra": {"component": "light", "dim": "brightness"}
    },
    {
      "hostname": ["ShellyBulbDuo-"],
      "name": "Shelly Duo",
      "gen": "gen1",
      "type": ["SHBDUO-1"],
      "id": "shellybulbduo",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_temperature", "measure_power", "meter_power", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "dim": {"opts": {"duration": true }}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellybulb.svg",
      "extra": {"component": "light", "dim": "brightness", "light_temperature": {"min": 3000, "max": 6500}}
    },
    {
      "hostname": ["shellydw-", "shellydw2-"],
      "name": "Shelly DW",
      "gen": "gen1",
      "type": ["SHDW-1", "SHDW-2"],
      "id": "shellydw2",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["alarm_contact", "measure_luminance", "measure_battery", "measure_temperature", "alarm_tamper", "tilt", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["CR123A", "CR123A"]},
      "triggers_1": ["triggerTilt"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellydw.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyem-"],
      "name": "Shelly EM",
      "gen": "gen1",
      "type": ["SHEM"],
      "id": "shellyem",
      "channels": 2,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "measure_voltage", "meter_power", "meter_power_returned", "rssi", "deviceGen1"],
      "capabilities_2": ["onoff", "measure_power", "measure_voltage", "meter_power", "meter_power_returned"],
      "capability_options": {},
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power_returned"},
      "triggers_1": ["triggerMeterPowerReturned"],
      "triggers_2": ["triggerMeterPowerReturned"],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyem.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["shellyflood-"],
      "name": "Shelly Flood",
      "gen": "gen1",
      "type": ["SHWT-1"],
      "id": "shellyflood",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["alarm_water", "measure_temperature", "measure_battery", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["CR123A"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyflood.svg",
      "extra": {}
    },
    {
      "hostname": ["shellygas-"],
      "name": "Shelly Gas",
      "gen": "gen1",
      "type": ["SHGS-1"],
      "id": "shellygas",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "sensor",
      "capabilities_1": ["alarm_gas", "gas_concentration", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": ["triggerGasConcentration"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellygas.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyht-"],
      "name": "Shelly HT",
      "gen": "gen1",
      "type": ["SHHT-1"],
      "id": "shellyht",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["measure_humidity", "measure_temperature", "measure_battery", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["CR123A"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyht.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyi3-", "shellyix3-"],
      "name": "Shelly i3",
      "gen": "gen1",
      "type": ["SHIX3-1"],
      "id": "shellyi3",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "other",
      "capabilities_1": ["input_1", "input_2", "input_3", "rssi", "actionEvents", "deviceGen1", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush_1", "longpush_1", "double_shortpush_1", "triple_shortpush_1", "shortpush_longpush_1", "longpush_shortpush_1", "shortpush_2", "longpush_2", "double_shortpush_2", "triple_shortpush_2", "shortpush_longpush_2", "longpush_shortpush_2", "shortpush_3", "longpush_3", "double_shortpush_3", "triple_shortpush_3", "shortpush_longpush_3", "longpush_shortpush_3"],
      "icon": "../../../assets/icons/shellyi3.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplusi4-", "ShellyPlusI4-"],
      "name": "Shelly Plus i4",
      "gen": "gen2",
      "type": ["SNSN-0024X", "SNSN-0D24X"],
      "id": "shellyplusi4",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["input_1", "input_2", "input_3", "input_4", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInput2On",
        "triggerInput2Off",
        "triggerInput2Changed",
        "triggerInput3On",
        "triggerInput3Off",
        "triggerInput3Changed",
        "triggerInput4On",
        "triggerInput4Off",
        "triggerInput4Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent"
      ],
      "triggers_2": [],
      "callbacks": [
        "single_push_1",
        "long_push_1",
        "double_push_1",
        "triple_push_1",
        "single_push_2",
        "long_push_2",
        "double_push_2",
        "triple_push_2",
        "single_push_3",
        "long_push_3",
        "triple_push_3",
        "double_push_3",
        "single_push_4",
        "long_push_4",
        "double_push_4",
        "triple_push_4"
      ],
      "icon": "../../../assets/icons/shellyi4.svg",
      "extra": {}
    },
    {
      "hostname": ["shellymotionsensor-"],
      "name": "Shelly Motion",
      "gen": "gen1",
      "type": ["SHMOS-01"],
      "id": "shellymotionsensor",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["alarm_motion", "measure_luminance", "measure_battery", "alarm_tamper", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["INTERNAL"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellymotion.svg",
      "extra": {}
    },
    {
      "hostname": ["shellymotion2-"],
      "name": "Shelly Motion 2",
      "gen": "gen1",
      "type": ["SHMOS-02"],
      "id": "shellymotion2",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["alarm_motion", "measure_luminance", "measure_temperature", "measure_battery", "alarm_tamper", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["INTERNAL"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellymotion.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyrgbw2-"],
      "name": "Shelly RGBW2 Color",
      "gen": "gen1",
      "type": ["SHRGBW2"],
      "id": "shellyrgbw2",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "dim.white", "light_hue", "light_saturation", "measure_power", "meter_power", "onoff.whitemode", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "dim": {"opts": {"duration": true}},
        "dim.white": {"title": {"en": "Dim level white","nl": "Dim niveau wit"}, "opts": {"duration": true}},
        "onoff.whitemode": {"title": {"en": "Toggle white mode","nl": "Wit modus schakelen"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed"],
      "triggers_2": [],
      "callbacks": ["longpush", "shortpush"],
      "icon": "../../../assets/icons/shellyrgbw2.svg",
      "extra": {"component": "color", "dim": "gain", "light_temperature": {"min": 0, "max": 255}}
    },
    {
      "hostname": ["shellyrgbw2-white-"],
      "name": "Shelly RGBW2 White",
      "gen": "gen1",
      "type": ["SHRGBW2"],
      "id": "shellyrgbw2-white",
      "channels": 4,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "measure_power.total", "meter_power", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": ["onoff", "dim", "measure_power", "meter_power"],
      "capability_options": {
        "dim": {"opts": {"duration": true}},
        "measure_power.total": {"title": {"en": "Total Power", "nl": "Totaal vermogen"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyrgbw2.svg",
      "extra": {"component": "white", "dim": "brightness"}
    },
    {
      "hostname": ["shellysmoke-"],
      "name": "Shelly Smoke",
      "gen": "gen1",
      "type": ["SHSM-01", "SHSM-02"],
      "id": "shellysmoke",
      "channels": 1,
      "communication": "coap",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["alarm_smoke", "measure_temperature", "measure_battery", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["AA"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellysmoke.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyuni-"],
      "name": "Shelly Uni",
      "gen": "gen1",
      "type": ["SHUNI-1"],
      "id": "shellyuni",
      "channels": 2,
      "communication": "coap",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_voltage", "input_1", "rssi", "actionEvents", "deviceGen1"],
      "capabilities_2": ["onoff", "input_1", "actionEvents"],
      "capability_options": {
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_voltage": {"title": {"en": "ADC Voltage","nl": "ADC Voltage"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerTemperature1", "triggerTemperature2", "triggerInput2Changed", "triggerTemperature3", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["shortpush", "longpush"],
      "icon": "../../../assets/icons/shellyuni.svg",
      "extra": {"component": "relay"}
    },
    {
      "hostname": ["ShellyVintage-"],
      "name": "Shelly Vintage",
      "gen": "gen1",
      "type": ["SHVIN-1"],
      "id": "shellyvintage",
      "channels": 1,
      "communication": "coap",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "rssi", "deviceGen1"],
      "capabilities_2": [],
      "capability_options": {
        "dim": {"opts": {"duration": true}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyrgbw2.svg",
      "extra": {"component": "light", "dim": "brightness"}
    },
    {
      "hostname": ["shellypluswdus-", "ShellyPlusWDUS-"],
      "name": "Shelly Plus Wall Dimmer",
      "gen": "gen2",
      "type": ["SNDM-0013US"],
      "id": "shellypluswdus",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "dim": {"opts": {"duration": false }},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-plus-walldimmer-us.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shellypro3em-", "ShellyPro3EM-", "shellypro3em-monophase-", "ShellyPro3EM-monophase-", "shellypro3em400-", "ShellyPro3EM400-", "shellypro3em400-monophase-", "ShellyPro3EM400-monophase-", "shellypro3em63-", "ShellyPro3EM63-", "shellypro3em63-monophase-", "ShellyPro3EM63-monophase-"],
      "name": "Shelly Pro 3EM",
      "gen": "gen2",
      "type": ["SPEM-003CEBEU", "SPEM-003CEBEU120", "SPEM-003CEBEU400", "SPEM-003CEBEU63"],
      "id": "shellypro3em-monophase",
      "channels": 3,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["measure_power", "measure_power_apparent", "measure_power.total", "measure_current", "measure_current.total", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned", "meter_power.total", "meter_power.total_returned", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": ["measure_power", "measure_power_apparent", "measure_current", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_power.total": {"title": {"en": "Total Power", "nl": "Totale power"}},
        "measure_current.total": {"title": {"en": "Total Current", "nl": "Totale stroomsterkte"}},
        "meter_power.total": {"title": {"en": "Total Energy", "nl": "Totale energie"}},
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "meter_power.total_returned": {"title": {"en": "Total Energy Returned", "nl": "Totale retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power.returned"},
      "triggers_1": ["triggerMeterPowerFactor", "triggerMeasurePowerTotal", "triggerMeterPowerTotal", "triggerMeterPowerReturned", "triggerMeterPowerReturnedTotal"],
      "triggers_2": ["triggerMeterPowerFactor","triggerMeterPowerReturned"],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-pro-3em.svg",
      "extra": {}
    },
    {
      "hostname": ["shellypro3em-triphase-", "ShellyPro3EM400-triphase-", "shellypro3em400-triphase-", "ShellyPro3EM-triphase-", "shellypro3em63-triphase-", "ShellyPro3EM63-triphase-"],
      "name": "Shelly Pro 3EM Triphase",
      "gen": "gen2",
      "type": ["SPEM-003CEBEU", "SPEM-003CEBEU120", "SPEM-003CEBEU400", "SPEM-003CEBEU63"],
      "id": "shellypro3em-triphase",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["measure_power", "measure_power.a", "measure_power.b", "measure_power.c", "meter_power", "meter_power.a", "meter_power.b", "meter_power.c", "measure_current", "measure_current.a", "measure_current.b", "measure_current.c", "meter_power.total_returned", "measure_voltage.a", "measure_voltage.b", "measure_voltage.c", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_power": {"title": {"en": "Total Power", "nl": "Totale power"}},
        "measure_power.a": {"title": {"en": "Power Phase A", "nl": "Power fase A"}},
        "measure_power.b": {"title": {"en": "Power Phase B", "nl": "Power fase B"}},
        "measure_power.c": {"title": {"en": "Power Phase C", "nl": "Power fase C"}},
        "measure_current": {"title": {"en": "Total Current", "nl": "Totale stroomsterkte"}},
        "measure_current.a": {"title": {"en": "Current Phase A", "nl": "Stroomsterkte fase A"}},
        "measure_current.b": {"title": {"en": "Current Phase B", "nl": "Stroomsterkte fase B"}},
        "measure_current.c": {"title": {"en": "Current Phase C", "nl": "Stroomsterkte fase C"}},
        "measure_voltage.a": {"title": {"en": "Voltage Phase A", "nl": "Voltage fase A"}},
        "measure_voltage.b": {"title": {"en": "Voltage Phase B", "nl": "Voltage fase B"}},
        "measure_voltage.c": {"title": {"en": "Voltage Phase C", "nl": "Voltage fase C"}},
        "meter_power": {"title": {"en": "Total Energy", "nl": "Totale energie"}},
        "meter_power.a": {"title": {"en": "Energy Phase A", "nl": "Energie fase A"}},
        "meter_power.b": {"title": {"en": "Energy Phase B", "nl": "Energie fase B"}},
        "meter_power.c": {"title": {"en": "Energy Phase C", "nl": "Energie fase C"}},
        "meter_power.total_returned": {"title": {"en": "Total Energy Returned", "nl": "Totale retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power.total_returned"},
      "triggers_1": ["triggerMeasurePowerTotal", "triggerMeterPowerTotal", "triggerMeterPowerReturned", "triggerMeterPowerReturnedTotal"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-pro-3em.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplussmoke-", "ShellyPlusSmoke-"],
      "name": "Shelly Plus Smoke",
      "gen": "gen2",
      "type": ["SNSN-0031Z"],
      "id": "shellyplussmoke",
      "channels": 1,
      "communication": "websocket",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["alarm_smoke", "measure_battery", "measure_voltage", "rssi", "deviceGen2", "devicePlusSmoke"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {"batteries": ["CR123A"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-plus-smoke.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplusplugs-", "ShellyPlusPlugS-", "shellyplusplugit-", "ShellyPlusPlugIT-", "ShellyPlugIT-", "shellypluspluguk-", "ShellyPlusPlugUK-", "ShellyPlugUK-", "shellyplusplugus-", "ShellyPlusPlugUS-", "ShellyPlugUS-"],
      "name": "Shelly Plus Plug S",
      "gen": "gen2",
      "type": ["SNPL-00112EU", "SNPL-00110IT", "SNPL-00112UK", "SNPL-00116US", "SNPL-10112EU"],
      "id": "shellyplusplugs",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2", "devicePlusPlugS"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-plus-plug-s.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyblubutton1-", "ShellyBLUButton1-"],
      "name": "Shelly BLU Button 1",
      "gen": "gen2",
      "type": ["SBBT-002C", "SBBT-00", "SBBT-"],
      "id": "shellyblubutton1",
      "channels": 1,
      "communication": "bluetooth",
      "battery": true,
      "class": "button",
      "capabilities_1": ["measure_battery", "beacon", "actionEvents", "deviceBLU"],
      "capabilities_2": [],
      "capability_options": {},
      "settings": {"beacon_timeout": 5},
      "energy": {"batteries": ["CR2032"]},
      "triggers_1": ["triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush", "double_shortpush", "triple_shortpush", "longpush", "very_longpush", "hold"],
      "icon": "../../../assets/icons/shellyblubutton1.svg",
      "extra": {}
    },
    {
      "hostname": ["shellybludoorwindow-", "ShellyBLUDoorWindow-"],
      "name": "Shelly BLU DoorWindow",
      "gen": "gen2",
      "type": ["SBDW-002C", "SBDW-00", "SBDW-"],
      "id": "shellybludoorwindow",
      "channels": 1,
      "communication": "bluetooth",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["measure_battery", "alarm_contact", "measure_luminance", "tilt", "deviceBLU"],
      "capabilities_2": [],
      "capability_options": {},
      "settings": {"invertAlarm": false},
      "energy": {"batteries": ["CR2032"]},
      "triggers_1": ["triggerTilt"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellydw.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyproem50-", "ShellyProEM50-"],
      "name": "Shelly Pro EM",
      "gen": "gen2",
      "type": ["SPEM-002CEBEU50"],
      "id": "shellyproem50",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["onoff", "measure_power", "measure_power_apparent", "measure_current", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": ["measure_power", "measure_power_apparent", "measure_current", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "meter_power.returned": {"title": {"en": "Total Energy Returned", "nl": "Totale retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power.returned"},
      "triggers_1": ["triggerMeterPowerFactor", "triggerMeterPowerReturned"],
      "triggers_2": ["triggerMeterPowerFactor", "triggerMeterPowerReturned"],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-pro-3em.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellypro2cover-", "ShellyPro2Cover-"],
      "name": "Shelly Pro Dual Cover",
      "gen": "gen2",
      "type": ["SPSH-002PE16EU"],
      "id": "shellypro2cover",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiDividedInputs"],
      "capabilities_2": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_3", "input_4", "actionEvents", "multiDividedInputs"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed", "triggerActionEvent"],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2", "single_push_3", "long_push_3", "double_push_3", "triple_push_3", "single_push_4", "long_push_4", "double_push_4", "triple_push_4"],
      "icon": "../../../assets/icons/shelly-pro-4pm.svg",
      "extra": {}
    },
    {
      "hostname": ["shellywalldisplay-", "ShellyWallDisplay-", "shellywalldisplayx2-", "ShellyWallDisplayX2-"],
      "name": "Shelly Wall Display",
      "gen": "gen2",
      "type": ["SAWD-0A1XX10EU1", "SAWD-2A1XX10EU1"],
      "id": "shellywalldisplay",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "measure_humidity", "measure_luminance", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellywalldisplay.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellywalldisplay-thermostat-", "ShellyWallDisplay-thermostat-", "shellywalldisplayx2-thermostat-", "ShellyWallDisplayX2-thermostat-"],
      "name": "Shelly Wall Display Thermostat",
      "gen": "gen2",
      "type": ["SAWD-0A1XX10EU1", "SAWD-2A1XX10EU1"],
      "id": "shellywalldisplay-thermostat",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "thermostat",
      "capabilities_1": ["measure_temperature", "measure_humidity", "measure_luminance", "measure_temperature.thermostat", "target_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature.thermostat": {"title": {"en": "Thermostat Temperature","nl": "Thermostaat temperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellywalldisplay.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyblumotion-"],
      "name": "Shelly BLU Motion",
      "gen": "gen2",
      "type": ["SBMO-003Z", "SBMO-00", "SBMO-"],
      "id": "shellyblumotion",
      "channels": 1,
      "communication": "bluetooth",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["measure_battery", "alarm_motion", "measure_luminance", "deviceBLU"],
      "capabilities_2": [],
      "capability_options": {},
      "settings": {},
      "energy": {"batteries":["CR2477"]},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyblumotion.svg",
      "extra": {}
    },
    {
      "hostname": ["shellypmmini-", "ShellyPMMini-"],
      "name": "Shelly Plus PM Mini",
      "gen": "gen2",
      "type": ["SNPM-001PCEU16"],
      "id": "shellypluspmmini",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "sensor",
      "capabilities_1": ["measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-plus-pm-mini.svg",
      "extra": {}
    },
    {
      "hostname": ["shelly1mini-", "Shelly1Mini-"],
      "name": "Shelly Plus 1 Mini",
      "gen": "gen2",
      "type": ["SNSW-001X8EU"],
      "id": "shellyplus1mini",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1-mini.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shelly1pmmini-", "Shelly1PMMini-"],
      "name": "Shelly Plus 1PM Mini",
      "gen": "gen2",
      "type": ["SNSW-001P8EU"],
      "id": "shellyplus1pmmini",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-pm-mini.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyplusuni-", "ShellyPlusUni-"],
      "name": "Shelly Plus Uni",
      "gen": "gen2",
      "type": ["SNSN-0043X"],
      "id": "shellyplusuni",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "input_1", "rssi", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "input_1", "actionEvents"],
      "capability_options": {
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_voltage": {"title": {"en": "ADC Voltage","nl": "ADC Voltage"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerTemperature1", "triggerTemperature2", "triggerInput2Changed", "triggerTemperature3", "triggerActionEvent", "triggerInputCountsTotal", "triggerInputCountsMinute"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shellyuni.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyblugw-", "ShellyBluGw-"],
      "name": "Shelly Blu Gateway",
      "gen": "gen2",
      "type": ["SBGW-001X", "SNGW-BT01"],
      "id": "shellyblugw",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyblugateway.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplus010v-", "ShellyPlus010V-"],
      "name": "Shelly Plus 0-10V Dimmer",
      "gen": "gen2",
      "type": ["SNDM-00100WW", "SNGW-0A11WW010"],
      "id": "shellyplus010v",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "input_1", "input_2", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true }},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-plus-10v-dimmer.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shellypmminig3-", "ShellyPMMiniG3-"],
      "name": "Shelly Plus PM Mini Gen3",
      "gen": "gen3",
      "type": ["S3PM-001PCEU16"],
      "id": "shellypluspmminig3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "sensor",
      "capabilities_1": ["measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerMeterPowerReturned", "triggerVirtualComponents"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shelly-plus-pm-mini.svg",
      "extra": {}
    },
    {
      "hostname": ["shelly1minig3-", "Shelly1MiniG3-"],
      "name": "Shelly Plus 1 Mini Gen3",
      "gen": "gen3",
      "type": ["S3SW-001X8EU"],
      "id": "shellyplus1minig3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent", "triggerVirtualComponents"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1-mini.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shelly1pmminig3-", "Shelly1PMMiniG3-"],
      "name": "Shelly Plus 1PM Mini Gen3",
      "gen": "gen3",
      "type": ["S3SW-001P8EU"],
      "id": "shellyplus1pmminig3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerMeterPowerReturned", "triggerActionEvent", "triggerVirtualComponents"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-pm-mini.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["0x0081", "129"],
      "name": "Shelly Wave PM Mini",
      "gen": "zwave",
      "type": ["0x0081", "129"],
      "id": "shellywavepmmini",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "other",
      "capabilities_1": ["measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0083", "131", "0x008E", "142"],
      "name": "Shelly Wave 1 (Mini)",
      "gen": "zwave",
      "type": ["0x0083", "131", "0x008E", "142"],
      "id": "shellywave1",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0084", "132", "0x008F", "143"],
      "name": "Shelly Wave 1PM (Mini)",
      "gen": "zwave",
      "type": ["0x0084", "132", "0x008F", "143"],
      "id": "shellywave1pm",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0081", "129"],
      "name": "Shelly Wave 2PM",
      "gen": "zwave",
      "type": ["0x0081", "129"],
      "id": "shellywave2pm",
      "channels": 2,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "button.reset_meter", "deviceWave"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0088", "0x0089", "136", "137"],
      "name": "Shelly Wave Plug",
      "gen": "zwave",
      "type": ["0x0088", "0x0089", "136", "137"],
      "id": "shellywaveplug",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x008A", "138"],
      "name": "Shelly Wave Pro 1",
      "gen": "zwave",
      "type": ["0x008A", "138"],
      "id": "shellywavepro1",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x008B", "139"],
      "name": "Shelly Wave Pro 1PM",
      "gen": "zwave",
      "type": ["0x008B", "139"],
      "id": "shellywavepro1pm",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x008C", "140"],
      "name": "Shelly Wave Pro 2",
      "gen": "zwave",
      "type": ["0x008C", "140"],
      "id": "shellywavepro2",
      "channels": 2,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "deviceWave"],
      "capabilities_2": ["onoff", "deviceWave"],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x008D", "141"],
      "name": "Shelly Wave Pro 2PM",
      "gen": "zwave",
      "type": ["0x008D", "141"],
      "id": "shellywavepro2pm",
      "channels": 2,
      "communication": "zwave",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "button.reset_meter", "deviceWave"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0082", "130"],
      "name": "Shelly Wave Shutter",
      "gen": "zwave",
      "type": ["0x0082", "130"],
      "id": "shellywaveshutter",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_set", "measure_power", "meter_power", "button.reset_meter", "button.calibration", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0081", "0x0082", "129", "130"],
      "name": "Shelly Wave i4",
      "gen": "zwave",
      "type": ["0x0081", "0x0082", "129", "130"],
      "id": "shellywavei4",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "other",
      "capabilities_1": ["input_1", "input_2", "input_3", "input_4", "actionEvents", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInput2On",
        "triggerInput2Off",
        "triggerInput2Changed",
        "triggerInput3On",
        "triggerInput3Off",
        "triggerInput3Changed",
        "triggerInput4On",
        "triggerInput4Off",
        "triggerInput4Changed",
        "triggerActionEvent"
      ],
      "triggers_2": [],
      "callbacks": [
        "single_push_1",
        "long_push_1",
        "double_push_1",
        "released_1",
        "single_push_2",
        "long_push_2",
        "double_push_2",
        "released_2",
        "single_push_3",
        "long_push_3",
        "double_push_3",
        "released_3",
        "single_push_4",
        "long_push_4",
        "double_push_4",
        "released_4"
      ],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyprodm1pm-", "ShellyProDM1PM-", "shellypro0110pm-", "ShellyPro0110PM-"],
      "name": "Shelly Pro Dimmer 1PM / 0/1-10V PM",
      "gen": "gen2",
      "type": ["SPDM-001PE01EU", "SPCC-001PE10EU"],
      "id": "shellyprodm1pm",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "actionEvents", "multiInputs", "deviceGen2"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true }}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-pro-dimmer-2.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shellyprodm2pm-", "ShellyProDM2PM-"],
      "name": "Shelly Pro Dimmer 2PM",
      "gen": "gen2",
      "type": ["SPDM-002PE01EU"],
      "id": "shellyprodm2pm",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "actionEvents", "multiDividedInputs", "deviceGen2"],
      "capabilities_2": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_3", "input_4", "rssi", "actionEvents", "multiDividedInputs"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true }}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      "triggers_2": ["triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed", "triggerActionEvent"],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2", "single_push_3", "long_push_3", "double_push_3", "triple_push_3", "single_push_4", "long_push_4", "double_push_4", "triple_push_4"],
      "icon": "../../../assets/icons/shelly-pro-dimmer-2.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shellybluht-", "ShellyBLUHT-"],
      "name": "Shelly BLU HT",
      "gen": "gen2",
      "type": ["SBHT-003C", "SBHT-00", "SBHT-"],
      "id": "shellybluht",
      "channels": 1,
      "communication": "bluetooth",
      "battery": true,
      "class": "sensor",
      "capabilities_1": ["measure_battery", "beacon", "measure_temperature", "measure_humidity", "actionEvents", "deviceBLU"],
      "capabilities_2": [],
      "capability_options": {},
      "settings": {"beacon_timeout": 5},
      "energy": {"batteries": ["CR2032"]},
      "triggers_1": ["triggerActionEvent"],
      "triggers_2": [],
      "callbacks": ["shortpush", "hold"],
      "icon": "../../../assets/icons/shellybluht.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplusrgbwpm-rgbw-", "ShellyPlusRGBWPM-rgbw-", "ShellyPlusRGBWPM-"],
      "name": "Shelly Plus RGBW PM RGBW",
      "gen": "gen2",
      "type": ["SNDC-0D4P10WW"],
      "id": "shellyplusrgbwpm-rgbw",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "dim.white", "light_hue", "light_saturation", "measure_power", "meter_power", "measure_voltage", "measure_current", "onoff.whitemode", "measure_temperature", "input_1", "input_2", "input_3", "input_4", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true}},
        "dim.white": {"title": {"en": "Dim level white","nl": "Dim niveau wit"}, "opts": {"duration": true}},
        "onoff.whitemode": {"title": {"en": "Toggle white mode","nl": "Wit modus schakelen"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2", "single_push_3", "long_push_3", "double_push_3", "triple_push_3", "single_push_4", "long_push_4", "double_push_4", "triple_push_4"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "RGBW", "dim": "brightness"}
    },
    {
      "hostname": ["shellyplusrgbwpm-rgb-", "ShellyPlusRGBWPM-rgb-"],
      "name": "Shelly Plus RGBW PM RGB",
      "gen": "gen2",
      "type": ["SNDC-0D4P10WW"],
      "id": "shellyplusrgbwpm-rgb",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_hue", "light_saturation", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "input_3", "input_4", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2", "single_push_3", "long_push_3", "double_push_3", "triple_push_3", "single_push_4", "long_push_4", "double_push_4", "triple_push_4"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "RGB", "dim": "brightness"}
    },
    {
      "hostname": ["shellyplusrgbwpm-light-", "ShellyPlusRGBWPM-light-"],
      "name": "Shelly Plus RGBW PM Light",
      "gen": "gen2",
      "type": ["SNDC-0D4P10WW"],
      "id": "shellyplusrgbwpm-light",
      "channels": 4,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "actionEvents", "deviceGen2"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shelly0110dimg3-", "shellyddimmerg3-", "Shelly0110DimG3-", "ShellyDDimmerG3-"],
      "name": "Shelly (Dali) Dimmer (0/1-10V PM) Gen3",
      "gen": "gen3",
      "type": ["S3DM-0010WW", "S3DM-0A1WW"],
      "id": "shelly0110dimg3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "input_1", "input_2", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true }},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInput2On",
        "triggerInput2Off",
        "triggerInput2Changed",
        "triggerActionEvent",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed"
      ],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-plus-10v-dimmer.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shelly1g3-", "Shelly1G3-"],
      "name": "Shelly 1 Gen3",
      "gen": "gen3",
      "type": ["S3SW-001X16EU"],
      "id": "shelly1g3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1 test", "nl": "Voltagemeter 1 test"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents"
      ],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shelly1pmg3-", "Shelly1PMG3-"],
      "name": "Shelly 1PM Gen3",
      "gen": "gen3",
      "type": ["S3SW-001P16EU"],
      "id": "shelly1pmg3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents"
      ],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shellyi4g3-", "ShellyI4G3-"],
      "name": "Shelly i4 Gen3",
      "gen": "gen3",
      "type": ["S3SN-0024X"],
      "id": "shellyplusi4",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["input_1", "input_2", "input_3", "input_4", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInput2On",
        "triggerInput2Off",
        "triggerInput2Changed",
        "triggerInput3On",
        "triggerInput3Off",
        "triggerInput3Changed",
        "triggerInput4On",
        "triggerInput4Off",
        "triggerInput4Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents"
      ],
      "triggers_2": [],
      "callbacks": [
        "single_push_1",
        "long_push_1",
        "double_push_1",
        "triple_push_1",
        "single_push_2",
        "long_push_2",
        "double_push_2",
        "triple_push_2",
        "single_push_3",
        "long_push_3",
        "triple_push_3",
        "double_push_3",
        "single_push_4",
        "long_push_4",
        "double_push_4",
        "triple_push_4"
      ],
      "icon": "../../../assets/icons/shellyi4.svg",
      "extra": {}
    },
    {
      "hostname": ["shellybluwallswitch4-", "ShellyBLUWallSwitch4-"],
      "name": "Shelly BLU Wall Switch 4",
      "gen": "gen2",
      "type": ["SBBT-004CEU", "SBBT-EU"],
      "id": "shellybluwallswitch4",
      "channels": 1,
      "communication": "bluetooth",
      "battery": true,
      "class": "button",
      "capabilities_1": ["measure_battery", "actionEvents", "deviceBLU"],
      "capabilities_2": [],
      "capability_options": {},
      "settings": {},
      "energy": {"batteries": ["CR2032"]},
      "triggers_1": ["triggerActionEvent"],
      "triggers_2": [],
      "callbacks": [
        "shortpush_1",
        "double_shortpush_1",
        "triple_shortpush_1",
        "longpush_1",
        "very_longpush_1",
        "hold_1",
        "shortpush_2",
        "double_shortpush_2",
        "triple_shortpush_2",
        "longpush_2",
        "very_longpush_2",
        "hold_2",
        "shortpush_3",
        "double_shortpush_3",
        "triple_shortpush_3",
        "longpush_3",
        "very_longpush_3",
        "hold_3",
        "shortpush_4",
        "double_shortpush_4",
        "triple_shortpush_4",
        "longpush_4",
        "very_longpush_4",
        "hold_4"
      ],
      "icon": "../../../assets/icons/shellybluwallswitch4.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyblubutton4-", "ShellyBLUButton4-"],
      "name": "Shelly BLU Button 4",
      "gen": "gen2",
      "type": ["SBBT-004CUS", "SBBT-US"],
      "id": "shellyblubutton4",
      "channels": 1,
      "communication": "bluetooth",
      "battery": true,
      "class": "button",
      "capabilities_1": ["measure_battery", "actionEvents", "deviceBLU"],
      "capabilities_2": [],
      "capability_options": {},
      "settings": {},
      "energy": {"batteries": ["CR2032"]},
      "triggers_1": ["triggerActionEvent"],
      "triggers_2": [],
      "callbacks": [
        "shortpush_1",
        "double_shortpush_1",
        "triple_shortpush_1",
        "longpush_1",
        "very_longpush_1",
        "hold_1",
        "shortpush_2",
        "double_shortpush_2",
        "triple_shortpush_2",
        "longpush_2",
        "very_longpush_2",
        "hold_2",
        "shortpush_3",
        "double_shortpush_3",
        "triple_shortpush_3",
        "longpush_3",
        "very_longpush_3",
        "hold_3",
        "shortpush_4",
        "double_shortpush_4",
        "triple_shortpush_4",
        "longpush_4",
        "very_longpush_4",
        "hold_4"
      ],
      "icon": "../../../assets/icons/shellybluwallswitch4.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0084", "132"],
      "name": "Shelly Wave Pro Shutter",
      "gen": "zwave",
      "type": ["0x0084", "132"],
      "id": "shellywaveproshutter",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_set", "measure_power", "meter_power", "button.reset_meter", "button.calibration", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["0x0091", "145"],
      "name": "Shelly Wave Pro 3",
      "gen": "zwave",
      "type": ["0x0091", "145"],
      "id": "shellywavepro3",
      "channels": 3,
      "communication": "zwave",
      "battery": false,
      "class": "other",
      "capabilities_1": ["windowcoverings_set", "measure_power", "meter_power", "button.reset_meter", "button.calibration", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {},
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["xmod1"],
      "name": "Shelly X MOD1",
      "gen": "gen3",
      "type": ["XMOD1"],
      "id": "xmod1",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["button.enable_ble_script", "button.disable_ble_script", "rssi", "actionEvents", "deviceGen3", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature.1": {"title": {"en": "Temperature Sensor", "nl": "Temperatuursensor"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor", "nl": "Vochtsensor"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerTemperature1", "triggerHumidity1", "triggerActionEvent"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shellyx.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shelly2pmg3-", "Shelly2PMG3-", "shelly2pmg3-switch-", "Shelly2PMG3-switch-"],
      "name": "Shelly 2PM Gen3",
      "gen": "gen3",
      "type": ["S3SW-002P16EU"],
      "id": "shelly2pmg3-switch",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3"],
      "capabilities_2": ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "actionEvents"],
      "capability_options": {
        "meter_power.returned": {"title": {"en": "Energy Returned", "nl": "Retour energie"}},
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "measure_temperature.1": {"title": {"en": "Temperature Sensor 1", "nl": "Temperatuursensor 1"}},
        "measure_temperature.2": {"title": {"en": "Temperature Sensor 2", "nl": "Temperatuursensor 2"}},
        "measure_temperature.3": {"title": {"en": "Temperature Sensor 3", "nl": "Temperatuursensor 3"}},
        "measure_temperature.4": {"title": {"en": "Temperature Sensor 4", "nl": "Temperatuursensor 4"}},
        "measure_temperature.5": {"title": {"en": "Temperature Sensor 5", "nl": "Temperatuursensor 5"}},
        "measure_voltage.1": {"title": {"en": "Voltagemeter 1", "nl": "Voltagemeter 1"}},
        "measure_voltage.2": {"title": {"en": "Voltagemeter 2", "nl": "Voltagemeter 2"}},
        "measure_voltage.3": {"title": {"en": "Voltagemeter 3", "nl": "Voltagemeter 3"}},
        "measure_voltage.4": {"title": {"en": "Voltagemeter 4", "nl": "Voltagemeter 4"}},
        "measure_voltage.5": {"title": {"en": "Voltagemeter 5", "nl": "Voltagemeter 5"}},
        "measure_humidity.1": {"title": {"en": "Humidity Sensor 1", "nl": "Vochtsensor 1"}},
        "measure_humidity.2": {"title": {"en": "Humidity Sensor 2", "nl": "Vochtsensor 2"}},
        "measure_humidity.3": {"title": {"en": "Humidity Sensor 3", "nl": "Vochtsensor 3"}},
        "measure_humidity.4": {"title": {"en": "Humidity Sensor 4", "nl": "Vochtsensor 4"}},
        "measure_humidity.5": {"title": {"en": "Humidity Sensor 5", "nl": "Vochtsensor 5"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInputExternal1On", "triggerInputExternal1Off", "triggerTemperature1", "triggerTemperature2", "triggerTemperature3", "triggerActionEvent", "triggerVirtualComponents"],
      "triggers_2": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {"component": "Switch"}
    },
    {
      "hostname": ["shelly2pmg3-roller-", "Shelly2PMG3-roller-"],
      "name": "Shelly 2PM Gen3 Roller Shutter",
      "gen": "gen3",
      "type": ["S3SW-002P16EU"],
      "id": "shelly2pmg3-roller",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent", "triggerVirtualComponents"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyshutter-", "ShellyShutter-"],
      "name": "Shelly Shutter",
      "gen": "gen3",
      "type": ["S3SH-0A2P4EU"],
      "id": "shellyshutter",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "windowcoverings",
      "capabilities_1": ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent", "triggerVirtualComponents"],
      "triggers_2": [],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      "icon": "../../../assets/icons/shelly-plus-1.svg",
      "extra": {}
    },
    {
      hostname: ['shellydimmerg3-', 'ShellyDimmerG3-'],
      name: 'Shelly Dimmer Gen3',
      gen: 'gen3',
      type: ['S3DM-0A101WWL'],
      id: 'shellydimmerg3',
      channels: 1,
      communication: 'websocket',
      battery: false,
      class: 'light',
      capabilities_1: ["onoff", "dim", "measure_power", "meter_power", "measure_temperature", "input_1", "input_2", "rssi", "actionEvents", "deviceGen1", "multiInputs"],
      capabilities_2: [],
      capability_options: {
        measure_temperature: { title: { en: "Device Temperature", nl: "Apparaattemperatuur"}},
        dim: { opts: { duration: true }}
      },
      energy: {},
      triggers_1: ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerActionEvent"],
      triggers_2: [],
      callbacks: ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {"component": "light", "dim": "brightness"}
    },
    {
      "hostname": ["shellyprorgbwwpm-", "ShellyProRGBWWPM-", "shellyprorgbwwpm-light-", "ShellyProRGBWWPM-light-"],
      "name": "Shelly Pro RGBWW PM Lights",
      "gen": "gen2",
      "type": ["SPDC-0D5PE16EU"],
      "id": "shellyprorgbwwpm-light",
      "channels": 5,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2"],
      "capabilities_2": ["onoff", "dim", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "actionEvents", "deviceGen2"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-2.svg",
      "extra": {"component": "Light", "dim": "brightness"}
    },
    {
      "hostname": ["shellyprorgbwwpm-rgbcct-", "ShellyProRGBWWPM-rgbcct-"],
      "name": "Shelly Pro RGBWW PM RGB + CCT",
      "gen": "gen2",
      "type": ["SPDC-0D5PE16EU"],
      "id": "shellyprorgbwwpm-rgbcct",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_hue", "light_saturation", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "onoff.light", "dim.light", "measure_power.light", "meter_power.light", "measure_voltage.light", "measure_current.light", "measure_temperature.light", "light_temperature", "input_1", "input_2", "input_3", "input_4", "input_5", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiInputs"],
      "capabilities_2": [],
      "capability_options": {
        "onoff": {"title": {"en": "Turned On RGB", "nl": "Aangezet RGB"}},
        "onoff.light": {"title": {"en": "Turned On CCT", "nl": "Aangezet CCT"}},
        "measure_temperature": {"title": {"en": "Device Temperature RGB", "nl": "Apparaattemperatuur RGB"}},
        "measure_temperature.light": {"title": {"en": "Device Temperature CCT", "nl": "Apparaattemperatuur CCT"}},
        "dim": {"opts": {"duration": true}, "title": {"en": "Dim Level RGB", "nl": "Dim niveau RGB"}},
        "dim.light": {"opts": {"duration": true}, "title": {"en": "Dim Level CCT", "nl": "Dim niveau CCT"}},
        "measure_power": {"title": {"en": "Power RGB", "nl": "Vermogen RGB"}},
        "measure_power.light": {"title": {"en": "Power CCT", "nl": "Vermogen CCT"}},
        "meter_power": {"title": {"en": "Energy RGB", "nl": "Energie RGB"}},
        "meter_power.light": {"title": {"en": "Energy CCT", "nl": "Energie CCT"}},
        "meter_voltage": {"title": {"en": "Voltage RGB", "nl": "Voltage RGB"}},
        "meter_voltage.light": {"title": {"en": "Voltage CCT", "nl": "Voltage CCT"}},
        "meter_current": {"title": {"en": "Stroom RGB", "nl": "Stroom RGB"}},
        "meter_current.light": {"title": {"en": "Stroom CCT", "nl": "Stroom CCT"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed", "triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed"],
      "triggers_2": [],
      "callbacks": ["single_push", "long_push", "double_push", "triple_push"],
      "icon": "../../../assets/icons/shelly-pro-2.svg",
      "extra": {"component": "RGB", "dim": "brightness"}
    },
    {
      "hostname": ["shellyprorgbwwpm-cctx2-", "ShellyProRGBWWPM-cctx2-"],
      "name": "Shelly Pro RGBWW PM CCTx2",
      "gen": "gen2",
      "type": ["SPDC-0D5PE16EU"],
      "id": "shellyprorgbwwpm-cctx2",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_temperature", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiDividedInputs"],
      "capabilities_2": ["onoff", "dim", "light_temperature", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_3", "input_4", "input_5", "rssi", "actionEvents", "deviceGen2", "multiDividedInputs"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "dim": {"opts": {"duration": true}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed"],
      "triggers_2": ["triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed"],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2", "single_push_3", "long_push_3", "double_push_3", "triple_push_3", "single_push_4", "long_push_4", "double_push_4", "triple_push_4"],
      "icon": "../../../assets/icons/shelly-pro-2.svg",
      "extra": {"component": "CCT", "dim": "brightness"}
    },
    {
      "hostname": ["shellyprorgbwwpm-rgbx2light-", "ShellyProRGBWWPM-rgbx2light-"],
      "name": "Shelly Pro RGBWW PM RGB + Light x 2",
      "gen": "gen2",
      "type": ["SPDC-0D5PE16EU"],
      "id": "shellyprorgbwwpm-rgbx2light",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "light",
      "capabilities_1": ["onoff", "dim", "light_hue", "light_saturation", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "light_temperature", "onoff.light", "dim.light", "measure_power.light", "meter_power.light", "measure_voltage.light", "measure_current.light", "measure_temperature.light", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen2", "multiDividedInputs"],
      "capabilities_2": ["onoff.light", "dim.light", "light_temperature", "measure_power.light", "meter_power.light", "measure_voltage.light", "measure_current.light", "measure_temperature.light", "input_3", "input_4", "rssi", "actionEvents", "deviceGen2", "multiDividedInputs"],
      "capability_options": {
        "onoff": {"title": {"en": "Turned On RGB", "nl": "Aangezet RGB"}},
        "onoff.light": {"title": {"en": "Turned On Light", "nl": "Aangezet Licht"}},
        "measure_temperature": {"title": {"en": "Device Temperature RGB", "nl": "Apparaattemperatuur RGB"}},
        "measure_temperature.light": {"title": {"en": "Device Temperature Light", "nl": "Apparaattemperatuur Licht"}},
        "dim": {"opts": {"duration": true}, "title": {"en": "Dim Level RGB", "nl": "Dim niveau RGB"}},
        "dim.light": {"opts": {"duration": true}, "title": {"en": "Dim Level Light", "nl": "Dim niveau Licht"}},
        "measure_power": {"title": {"en": "Power RGB", "nl": "Vermogen RGB"}},
        "measure_power.light": {"title": {"en": "Power Light", "nl": "Vermogen Licht"}},
        "meter_power": {"title": {"en": "Energy RGB", "nl": "Energie RGB"}},
        "meter_power.light": {"title": {"en": "Energy Light", "nl": "Energie Licht"}},
        "meter_voltage": {"title": {"en": "Voltage RGB", "nl": "Voltage RGB"}},
        "meter_voltage.light": {"title": {"en": "Voltage Light", "nl": "Voltage Licht"}},
        "meter_current": {"title": {"en": "Stroom RGB", "nl": "Stroom RGB"}},
        "meter_current.light": {"title": {"en": "Stroom Light", "nl": "Stroom Licht"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed"],
      "triggers_2": ["triggerInput3On", "triggerInput3Off", "triggerInput3Changed", "triggerInput4On", "triggerInput4Off", "triggerInput4Changed"],
      "callbacks": ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2", "single_push_3", "long_push_3", "double_push_3", "triple_push_3", "single_push_4", "long_push_4", "double_push_4", "triple_push_4"],
      "icon": "../../../assets/icons/shelly-pro-2.svg",
      "extra": {"component": "RGB", "dim": "brightness"}
    },
    {
      "hostname": ["0x0081", "129"],
      "name": "Shelly Wave Pro Dimmer 1PM",
      "gen": "zwave",
      "type": ["0x0081", "129"],
      "id": "shellywaveprodimmer1pm",
      "channels": 1,
      "communication": "zwave",
      "battery": false,
      "class": "light",
      "capabilities_1": ["dim", "measure_power", "meter_power", "button.reset_meter", "deviceWave"],
      "capabilities_2": [],
      "capability_options": {
        "onoff.1": {"title": {"en": "SW1 Switch", "nl": "SW1 Switch"}},
        "onoff.2": {"title": {"en": "SW2 Switch", "nl": "SW2 Switch"}},
      },
      "energy": {},
      "triggers_1": ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerInput2On", "triggerInput2Off", "triggerInput2Changed"],
      "triggers_2": [],
      "callbacks": [
        "single_push_1",
        "long_push_1",
        "double_push_1",
        "released_1",
        "single_push_2",
        "long_push_2",
        "double_push_2",
        "released_2"
      ],
      "icon": "./assets/icon.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyplugsg3-", "ShellyPlugSG3-"],
      "name": "Shelly Plug S Gen3",
      "gen": "gen3",
      "type": ["S3PL-00112EU"],
      "id": "shellyplugsg3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "socket",
      "capabilities_1": ["onoff", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3", "devicePlusPlugS"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": ["triggerVirtualComponents"],
      "icon": "../../../assets/icons/shelly-plus-plug-s.svg",
      "extra": {"component": "Switch"}
    },
    {
      hostname: ["shellyoutdoorsg3-", "ShellyOutdoorSG3-"],
      name: "Shelly Outdoor Plug S Gen3",
      gen: "gen3",
      type: ["S3PL-20112EU"],
      id: "shellyoutdoorsg3",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3"],
      capabilities_2: [],
      capability_options: {
        measure_temperature: { title: { en: "Device Temperature", nl: "Apparaattemperatuur"}},
        "button.enable_ble_script": { maintenanceAction: true, title: { en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": { maintenanceAction: true, title: { en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}}
      },
      energy: {},
      triggers_1: [],
      triggers_2: [],
      callbacks: ["triggerVirtualComponents"],
      icon: "../../../assets/icons/shelly-plus-outdoor-plug-s.svg",
      extra: { component: "Switch"}
    },
    {
      "hostname": ["shellyblugwg3-", "ShellyBluGwG3-"],
      "name": "Shelly Blu Gateway Gen3",
      "gen": "gen3",
      "type": ["S3GW-1DBT001"],
      "id": "shellyblugwg3",
      "channels": 1,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {},
      "triggers_1": [],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyblugatewayg3.svg",
      "extra": {}
    },
    {
      "hostname": ["shellyblutrv-", "ShellyBluTRV-"],
      "name": "Shelly BLU TRV",
      "gen": "gen3",
      "type": ["BluTRV"],
      "id": "shellyblutrv",
      "channels": 1,
      "communication": "gateway",
      "battery": true,
      "class": "thermostat",
      "capabilities_1": ["target_temperature", "measure_temperature.thermostat", "measure_temperature", "measure_battery", "valve_position", "rssi", "deviceGen3"],
      "capabilities_2": [],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "target_temperature": {"min": 4, "max": 30},
        "measure_temperature.thermostat": {"title": {"en": "Estimated Thermostat Temperature","nl": "Geschatte thermostaat temperatuur"}},
      },
      "energy": {"batteries": ["AA", "AA"]},
      "triggers_1": ["triggerValvePosition"],
      "triggers_2": [],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyblutrv.svg",
      "extra": {"component": "BluTRV"}
    },
    {
      "hostname": ["shellyemg3-", "ShellyEMG3-"],
      "name": "Shelly EM Gen3",
      "gen": "gen3",
      "type": ["S3EM-002CXCEU"],
      "id": "shellyemg3",
      "channels": 2,
      "communication": "websocket",
      "battery": false,
      "class": "other",
      "capabilities_1": ["onoff", "measure_power", "measure_power_apparent", "measure_current", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3"],
      "capabilities_2": ["measure_power", "measure_power_apparent", "measure_current", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned"],
      "capability_options": {
        "measure_temperature": {"title": {"en": "Device Temperature", "nl": "Apparaattemperatuur"}},
        "meter_power.returned": {"title": {"en": "Total Energy Returned", "nl": "Totale retour energie"}},
        "button.enable_ble_script": {"maintenanceAction": true, "title": {"en": "Start BLE Proxy", "nl": "Start BLE Proxy"}},
        "button.disable_ble_script": {"maintenanceAction": true, "title": {"en": "Stop BLE Proxy", "nl": "Stop BLE Proxy"}}
      },
      "energy": {"cumulative": true, "cumulativeImportedCapability": "meter_power", "cumulativeExportedCapability": "meter_power.returned"},
      "triggers_1": ["triggerVirtualComponents", "triggerMeterPowerFactor", "triggerMeterPowerReturned"],
      "triggers_2": ["triggerMeterPowerFactor", "triggerMeterPowerReturned"],
      "callbacks": [],
      "icon": "../../../assets/icons/shellyem.svg",
      "extra": {"component": "Switch"}
    },
    {
      hostname: ["shelly3em63g3-", "Shelly3EM63G3-", "shelly3em63g3-monophase-", "Shelly3EM63G3-monophase-"],
      name: "Shelly 3EM-63 Gen3",
      gen: "gen3",
      type: ["S3EM-003CXCEU63"],
      id: "shelly3em63g3-monophase",
      channels: 3,
      communication: "websocket",
      battery: false,
      class: "sensor",
      capabilities_1: ["measure_power", "measure_power_apparent", "measure_power.total", "measure_current", "measure_current.total", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned", "meter_power.total", "meter_power.total_returned", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3"],
      capabilities_2: ["measure_power", "measure_power_apparent", "measure_current", "measure_voltage", "meter_power_factor", "meter_power", "meter_power.returned"],
      capability_options: {
        measure_temperature: { title: { en: "Device Temperature", nl: "Apparaattemperatuur"}},
        "measure_power.total": { title: { en: "Total Power", nl: "Totale power"}},
        "measure_current.total": { title: { en: "Total Current", nl: "Totale stroomsterkte"}},
        "meter_power.total": { title: { en: "Total Energy", nl: "Totale energie"}},
        "meter_power.returned": { title: { en: "Energy Returned", nl: "Retour energie"}},
        "meter_power.total_returned": { title: { en: "Total Energy Returned", nl: "Totale retour energie"}},
        "button.enable_ble_script": { maintenanceAction: true, title: { en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": { maintenanceAction: true, title: { en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}}
      },
      energy: { cumulative: true, cumulativeImportedCapability: "meter_power", cumulativeExportedCapability: "meter_power.returned"},
      triggers_1: ["triggerMeterPowerFactor", "triggerMeasurePowerTotal", "triggerMeterPowerTotal", "triggerMeterPowerReturned", "triggerMeterPowerReturnedTotal"],
      triggers_2: ["triggerMeterPowerFactor","triggerMeterPowerReturned"],
      callbacks: [],
      icon: "../../../assets/icons/shelly3em63.svg",
      extra: {}
    },
    {
      hostname: ["shelly3em63g3-triphase-", "Shelly3EM63G3-triphase-"],
      name: "Shelly 3EM-63 Gen3 Triphase",
      gen: "gen3",
      type: ["S3EM-003CXCEU63"],
      id: "shelly3em63g3-triphase",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "sensor",
      capabilities_1: ["measure_power", "measure_power.a", "measure_power.b", "measure_power.c", "meter_power", "meter_power.a", "meter_power.b", "meter_power.c", "measure_current", "measure_current.a", "measure_current.b", "measure_current.c", "meter_power.total_returned", "measure_voltage.a", "measure_voltage.b", "measure_voltage.c", "measure_temperature", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen3"],
      capabilities_2: [],
      capability_options: {
        measure_power: { title: { en: "Total Power", nl: "Totale power"}},
        "measure_power.a": { title: { en: "Power Phase A", nl: "Power fase A"}},
        "measure_power.b": { title: { en: "Power Phase B", nl: "Power fase B"}},
        "measure_power.c": { title: { en: "Power Phase C", nl: "Power fase C"}},
        measure_current: { title: { en: "Total Current", nl: "Totale stroomsterkte"}},
        "measure_current.a": { title: { en: "Current Phase A", nl: "Stroomsterkte fase A"}},
        "measure_current.b": { title: { en: "Current Phase B", nl: "Stroomsterkte fase B"}},
        "measure_current.c": { title: { en: "Current Phase C", nl: "Stroomsterkte fase C"}},
        "measure_voltage.a": { title: { en: "Voltage Phase A", nl: "Voltage fase A"}},
        "measure_voltage.b": { title: { en: "Voltage Phase B", nl: "Voltage fase B"}},
        "measure_voltage.c": { title: { en: "Voltage Phase C", nl: "Voltage fase C"}},
        meter_power: { title: { en: "Total Energy", nl: "Totale energie"}},
        "meter_power.a": { title: { en: "Energy Phase A", nl: "Energie fase A"}},
        "meter_power.b": { title: { en: "Energy Phase B", nl: "Energie fase B"}},
        "meter_power.c": { title: { en: "Energy Phase C", nl: "Energie fase C"}},
        "meter_power.total_returned": { title: { en: "Total Energy Returned", nl: "Totale retour energie"}},
        measure_temperature: { title: { en: "Device Temperature", nl: "Apparaattemperatuur"}},
        "button.enable_ble_script": { maintenanceAction: true, title: { en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": { maintenanceAction: true, title: { en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}}
      },
      energy: { cumulative: true, cumulativeImportedCapability: "meter_power", cumulativeExportedCapability: "meter_power.total_returned"},
      triggers_1: ["triggerMeasurePowerTotal", "triggerMeterPowerTotal", "triggerMeterPowerReturned", "triggerMeterPowerReturnedTotal"],
      triggers_2: [],
      callbacks: [],
      icon: "../../../assets/icons/shelly3em63.svg",
      extra: {}
    },
    {
      hostname: ["shelly1g4-", "Shelly1G4-"],
      name: "Shelly 1 Gen4",
      gen: "gen4",
      type: ["S4SW-001X16EU"],
      id: "shelly1g4",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4"],
      capabilities_2: [],
      capability_options: {
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur" }},
        "measure_temperature.1": {title: {en: "Temperature Sensor 1", nl: "Temperatuursensor 1"}},
        "measure_temperature.2": {title: {en: "Temperature Sensor 2", nl: "Temperatuursensor 2"}},
        "measure_temperature.3": {title: {en: "Temperature Sensor 3", nl: "Temperatuursensor 3"}},
        "measure_temperature.4": {title: {en: "Temperature Sensor 4", nl: "Temperatuursensor 4"}},
        "measure_temperature.5": {title: {en: "Temperature Sensor 5", nl: "Temperatuursensor 5"}},
        "measure_voltage.1": {title: {en: "Voltagemeter 1 test", nl: "Voltagemeter 1 test"}},
        "measure_voltage.2": {title: {en: "Voltagemeter 2", nl: "Voltagemeter 2"}},
        "measure_voltage.3": {title: {en: "Voltagemeter 3", nl: "Voltagemeter 3"}},
        "measure_voltage.4": {title: {en: "Voltagemeter 4", nl: "Voltagemeter 4"}},
        "measure_voltage.5": {title: {en: "Voltagemeter 5", nl: "Voltagemeter 5"}},
        "measure_humidity.1": {title: {en: "Humidity Sensor 1", nl: "Vochtsensor 1"}},
        "measure_humidity.2": {title: {en: "Humidity Sensor 2", nl: "Vochtsensor 2"}},
        "measure_humidity.3": {title: {en: "Humidity Sensor 3", nl: "Vochtsensor 3"}},
        "measure_humidity.4": {title: {en: "Humidity Sensor 4", nl: "Vochtsensor 4"}},
        "measure_humidity.5": {title: {en: "Humidity Sensor 5", nl: "Vochtsensor 5"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents",
      ],
      triggers_2: [],
      callbacks: ["single_push", "long_push", "double_push", "triple_push"],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {component: "Switch"}
    },
    {
      hostname: ["shelly1pmg4-", "Shelly1PMG4-"],
      name: "Shelly 1PM Gen4",
      gen: "gen4",
      type: ["S4SW-001P16EU"],
      id: "shelly1pmg4",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4"],
      capabilities_2: [],
      capability_options: {
        "meter_power.returned": {title: {en: "Energy Returned", nl: "Retour energie"}},
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur" }},
        "measure_temperature.1": {title: {en: "Temperature Sensor 1", nl: "Temperatuursensor 1"}},
        "measure_temperature.2": {title: {en: "Temperature Sensor 2", nl: "Temperatuursensor 2"}},
        "measure_temperature.3": {title: {en: "Temperature Sensor 3", nl: "Temperatuursensor 3"}},
        "measure_temperature.4": {title: {en: "Temperature Sensor 4", nl: "Temperatuursensor 4"}},
        "measure_temperature.5": {title: {en: "Temperature Sensor 5", nl: "Temperatuursensor 5"}},
        "measure_voltage.1": {title: {en: "Voltagemeter 1 test", nl: "Voltagemeter 1 test"}},
        "measure_voltage.2": {title: {en: "Voltagemeter 2", nl: "Voltagemeter 2"}},
        "measure_voltage.3": {title: {en: "Voltagemeter 3", nl: "Voltagemeter 3"}},
        "measure_voltage.4": {title: {en: "Voltagemeter 4", nl: "Voltagemeter 4"}},
        "measure_voltage.5": {title: {en: "Voltagemeter 5", nl: "Voltagemeter 5"}},
        "measure_humidity.1": {title: {en: "Humidity Sensor 1", nl: "Vochtsensor 1"}},
        "measure_humidity.2": {title: {en: "Humidity Sensor 2", nl: "Vochtsensor 2"}},
        "measure_humidity.3": {title: {en: "Humidity Sensor 3", nl: "Vochtsensor 3"}},
        "measure_humidity.4": {title: {en: "Humidity Sensor 4", nl: "Vochtsensor 4"}},
        "measure_humidity.5": {title: {en: "Humidity Sensor 5", nl: "Vochtsensor 5"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents",
      ],
      triggers_2: [],
      callbacks: ["single_push", "long_push", "double_push", "triple_push"],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {component: "Switch"}
    },
    {
      hostname: ["shelly2pmg4-", "Shelly2PMG4-", "shelly2pmg4-switch-", "Shelly2PMG4-switch-"],
      name: "Shelly 2PM Gen4",
      gen: "gen4",
      type: ["S4SW-002P16EU"],
      id: "shelly2pmg4-switch",
      channels: 2,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4"],
      capabilities_2: ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "actionEvents"],
      capability_options: {
        "meter_power.returned": {title: {en: "Energy Returned", nl: "Retour energie"}},
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur" }},
        "measure_temperature.1": {title: {en: "Temperature Sensor 1", nl: "Temperatuursensor 1"}},
        "measure_temperature.2": {title: {en: "Temperature Sensor 2", nl: "Temperatuursensor 2"}},
        "measure_temperature.3": {title: {en: "Temperature Sensor 3", nl: "Temperatuursensor 3"}},
        "measure_temperature.4": {title: {en: "Temperature Sensor 4", nl: "Temperatuursensor 4"}},
        "measure_temperature.5": {title: {en: "Temperature Sensor 5", nl: "Temperatuursensor 5"}},
        "measure_voltage.1": {title: {en: "Voltagemeter 1 test", nl: "Voltagemeter 1 test"}},
        "measure_voltage.2": {title: {en: "Voltagemeter 2", nl: "Voltagemeter 2"}},
        "measure_voltage.3": {title: {en: "Voltagemeter 3", nl: "Voltagemeter 3"}},
        "measure_voltage.4": {title: {en: "Voltagemeter 4", nl: "Voltagemeter 4"}},
        "measure_voltage.5": {title: {en: "Voltagemeter 5", nl: "Voltagemeter 5"}},
        "measure_humidity.1": {title: {en: "Humidity Sensor 1", nl: "Vochtsensor 1"}},
        "measure_humidity.2": {title: {en: "Humidity Sensor 2", nl: "Vochtsensor 2"}},
        "measure_humidity.3": {title: {en: "Humidity Sensor 3", nl: "Vochtsensor 3"}},
        "measure_humidity.4": {title: {en: "Humidity Sensor 4", nl: "Vochtsensor 4"}},
        "measure_humidity.5": {title: {en: "Humidity Sensor 5", nl: "Vochtsensor 5"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInputExternal1On",
        "triggerInputExternal1Off",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents"],
      triggers_2: ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      callbacks: ["single_push", "long_push", "double_push", "triple_push"],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {component: "Switch"}
    },
    {
      hostname: ["shelly2pmg4-roller-", "Shelly2PMG4-roller-"],
      name: "Shelly 2PM Gen4 Roller Shutter",
      gen: "gen4",
      type: ["S4SW-002P16EU"],
      id: "shelly2pmg4-roller",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "windowcoverings",
      capabilities_1: ["windowcoverings_state", "windowcoverings_set", "measure_power", "meter_power", "measure_voltage", "measure_current", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4", "multiInputs"],
      capability_options: {
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur" }},
        "measure_temperature.1": {title: {en: "Temperature Sensor 1", nl: "Temperatuursensor 1"}},
        "measure_temperature.2": {title: {en: "Temperature Sensor 2", nl: "Temperatuursensor 2"}},
        "measure_temperature.3": {title: {en: "Temperature Sensor 3", nl: "Temperatuursensor 3"}},
        "measure_temperature.4": {title: {en: "Temperature Sensor 4", nl: "Temperatuursensor 4"}},
        "measure_temperature.5": {title: {en: "Temperature Sensor 5", nl: "Temperatuursensor 5"}},
        "measure_voltage.1": {title: {en: "Voltagemeter 1 test", nl: "Voltagemeter 1 test"}},
        "measure_voltage.2": {title: {en: "Voltagemeter 2", nl: "Voltagemeter 2"}},
        "measure_voltage.3": {title: {en: "Voltagemeter 3", nl: "Voltagemeter 3"}},
        "measure_voltage.4": {title: {en: "Voltagemeter 4", nl: "Voltagemeter 4"}},
        "measure_voltage.5": {title: {en: "Voltagemeter 5", nl: "Voltagemeter 5"}},
        "measure_humidity.1": {title: {en: "Humidity Sensor 1", nl: "Vochtsensor 1"}},
        "measure_humidity.2": {title: {en: "Humidity Sensor 2", nl: "Vochtsensor 2"}},
        "measure_humidity.3": {title: {en: "Humidity Sensor 3", nl: "Vochtsensor 3"}},
        "measure_humidity.4": {title: {en: "Humidity Sensor 4", nl: "Vochtsensor 4"}},
        "measure_humidity.5": {title: {en: "Humidity Sensor 5", nl: "Vochtsensor 5"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInput2On",
        "triggerInput2Off",
        "triggerInput2Changed",
        "triggerInputExternal1On",
        "triggerInputExternal1Off",
        "triggerTemperature1",
        "triggerTemperature2",
        "triggerTemperature3",
        "triggerTemperature4",
        "triggerTemperature5",
        "triggerHumidity1",
        "triggerHumidity2",
        "triggerHumidity3",
        "triggerHumidity4",
        "triggerHumidity5",
        "triggerVoltmeter1",
        "triggerVoltmeter2",
        "triggerVoltmeter3",
        "triggerVoltmeter4",
        "triggerVoltmeter5",
        "triggerPlusInputExternal1On",
        "triggerPlusInputExternal1Off",
        "triggerPlusInputExternal1Changed",
        "triggerPlusInputExternal2On",
        "triggerPlusInputExternal2Off",
        "triggerPlusInputExternal2Changed",
        "triggerPlusInputExternal3On",
        "triggerPlusInputExternal3Off",
        "triggerPlusInputExternal3Changed",
        "triggerActionEvent",
        "triggerVirtualComponents"
      ],
      triggers_2: [],
      callbacks: ["single_push_1", "long_push_1", "double_push_1", "triple_push_1", "single_push_2", "long_push_2", "double_push_2", "triple_push_2"],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {}
    },
    {
      hostname: ["shelly1minig4-", "Shelly1MiniG4-"],
      name: "Shelly 1 Mini Gen4",
      gen: "gen4",
      type: ["S4SW-001X8EU"],
      id: "shelly1minig4",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4"],
      capabilities_2: [],
      capability_options: {
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent", "triggerVirtualComponents"],
      triggers_2: [],
      callbacks: ["single_push", "long_push", "double_push", "triple_push"],
      icon: "../../../assets/icons/shelly-plus-1-mini.svg",
      extra: {component: "Switch"},
    },
    {
      hostname: ["shelly1pmminig4-", "Shelly1PMMiniG4-"],
      name: "Shelly 1PM Mini Gen4",
      gen: "gen4",
      type: ["S4SW-001P8EU"],
      id: "shelly1pmminig4",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4"],
      capabilities_2: [],
      capability_options: {
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur"}},
        "meter_power.returned": {title: {en: "Energy Returned", nl: "Retour energie"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerMeterPowerReturned", "triggerActionEvent", "triggerVirtualComponents"],
      triggers_2: [],
      callbacks: ["single_push", "long_push", "double_push", "triple_push"],
      icon: "../../../assets/icons/shelly-plus-pm-mini.svg",
      extra: {component: "Switch"},
    },
    {
      hostname: ["shellyemminig4-", "ShellyEMMiniG4-"],
      name: "Shelly EM Mini Gen4",
      gen: "gen4",
      type: ["S4EM-001PXCEU16"],
      id: "shellyemminig4",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["measure_power", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen4"],
      capabilities_2: [],
      capability_options: {
        "meter_power.returned": {title: {en: "Energy Returned", nl: "Retour energie"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: ["triggerMeterPowerReturned", "triggerVirtualComponents"],
      triggers_2: [],
      callbacks: ["single_push", "long_push", "double_push", "triple_push"],
      icon: "../../../assets/icons/shelly-plus-pm-mini.svg",
      extra: {},
    },
    {
      hostname: ["shelly1lg3-", "Shelly1LG3-"],
      name: "Shelly 1L Gen3",
      gen: "gen3",
      type: ["S3SW-0A1X1EUL"],
      id: "shelly1lg3",
      channels: 1,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_temperature", "input_1", "input_2", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen3", "multiInputs"],
      capabilities_2: [],
      capability_options: {
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur" }},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerInput2On",
        "triggerInput2Off",
        "triggerInput2Changed",
        "triggerActionEvent",
        "triggerVirtualComponents",
      ],
      triggers_2: [],
      callbacks: [
        "single_push_1",
        "long_push_1",
        "double_push_1",
        "triple_push_1",
        "btn_up_1",
        "btn_down_1",
        "single_push_2",
        "long_push_2",
        "double_push_2",
        "triple_push_2",
        "btn_up_2",
        "btn_down_2",
      ],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {component: "Switch"}
    },
    {
      hostname: ["shelly2lg3-", "Shelly2LG3-"],
      name: "Shelly 2L Gen3",
      gen: "gen3",
      type: ["S3SW-0A2X4EUL"],
      id: "shelly2lg3-",
      channels: 2,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_temperature", "input_1", "rssi", "button.enable_ble_script", "button.disable_ble_script", "actionEvents", "deviceGen4"],
      capabilities_2: ["onoff", "measure_temperature", "input_1", "actionEvents"],
      capability_options: {
        measure_temperature: {title: {en: "Device Temperature", nl: "Apparaattemperatuur" }},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [
        "triggerInput1On",
        "triggerInput1Off",
        "triggerInput1Changed",
        "triggerActionEvent",
        "triggerVirtualComponents"
      ],
      triggers_2: ["triggerInput1On", "triggerInput1Off", "triggerInput1Changed", "triggerActionEvent"],
      callbacks: [
        "single_push",
        "long_push",
        "double_push",
        "triple_push",
        "btn_up",
        "btn_down"
      ],
      icon: "../../../assets/icons/shelly-plus-1.svg",
      extra: {component: "Switch"}
    },
    {
      hostname: ["shellypstripg4--", "ShellyPStripG4-"],
      name: "Shelly Power Strip 4 Gen4",
      gen: "gen4",
      type: ["S4PL-00416EU"],
      id: "shellypstripg4",
      channels: 4,
      communication: "websocket",
      battery: false,
      class: "socket",
      capabilities_1: ["onoff", "measure_power", "measure_power_apparent", "meter_power", "meter_power.returned", "measure_voltage", "measure_current", "rssi", "button.enable_ble_script", "button.disable_ble_script", "deviceGen4"],
      capabilities_2: ["onoff", "measure_power", "measure_power_apparent", "meter_power", "meter_power.returned", "measure_voltage", "measure_current"],
      capability_options: {
        "meter_power.returned": {title: {en: "Energy Returned", nl: "Retour energie"}},
        "button.enable_ble_script": {maintenanceAction: true, title: {en: "Start BLE Proxy", nl: "Start BLE Proxy"}},
        "button.disable_ble_script": {maintenanceAction: true, title: {en: "Stop BLE Proxy", nl: "Stop BLE Proxy"}},
      },
      energy: {},
      triggers_1: [],
      triggers_2: [],
      callbacks: ["triggerVirtualComponents"],
      icon: "../../../assets/icons/shelly-power-strip.svg",
      extra: {component: "Switch"}
    },
    {
      hostname: ["shellyfloodg4-", "ShellyFloodG4-"],
      name: "Shelly Flood Gen4",
      gen: "gen4",
      type: ["S4SN-0071A"],
      id: "shellyfloodg4",
      channels: 1,
      communication: "websocket",
      battery: true,
      class: "sensor",
      capabilities_1: ["alarm_water", "measure_battery", "rssi", "deviceGen4"],
      capabilities_2: [],
      capability_options: {},
      energy: {"batteries": ["AA", "AA", "AA", "AA"]},
      triggers_1: [],
      triggers_2: [],
      callbacks: [],
      icon: "../../../assets/icons/shelly-flood-gen4.svg",
      extra: {}
    }
  ];

  static ble_device_types = [
    "SBBT-",
    "SBDW-",
    "SBMO-",
    "SBHT-"
  ];

  static ble_script = `/**
  * Homey BLE Proxy Script
  * This script listens to BLE advertisements of Shelly BLU devices
  * and forwards them to Homey over websocket
  * Version: 6
  */

 // SUPPORTED DEVICES
 let supported_device = ['SBBT-', 'SBDW-', 'SBMO-', 'SBHT-'];

 let BTHOME_SVC_ID_STR = 'fcd2';
 let SCAN_DURATION = BLE.Scanner.INFINITE_SCAN;

 let uint8 = 0;
 let int8 = 1;
 let uint16 = 2;
 let int16 = 3;
 let uint24 = 4;
 let int24 = 5;

 function getByteSize(type) {
   if (type === uint8 || type === int8) return 1;
   if (type === uint16 || type === int16) return 2;
   if (type === uint24 || type === int24) return 3;
   return 255;
 }

 let BTH = [];
 BTH[0x00] = { n: 'pid', t: uint8 };
 BTH[0x01] = { n: 'measure_battery', t: uint8, u: '%' };
 BTH[0x05] = { n: 'measure_luminance', t: uint24, f: 0.01 };
 BTH[0x1a] = { n: 'alarm_contact_door', t: uint8 };
 BTH[0x2e] = { n: 'measure_humidity', t: uint8, u: "%" };
 BTH[0x45] = { n: 'measure_temperature', t: int16, f: 0.1, u: "tC" };
 BTH[0x2d] = { n: 'alarm_contact_window', t: uint8 };
 BTH[0x3a] = { n: 'button', t: uint8 };
 BTH[0x3f] = { n: 'tilt', t: int16, f: 0.1 };
 BTH[0x21] = { n: 'alarm_motion', t: this.uint8 };

 let BTHomeDecoder = {
   utoi: function (num, bitsz) {
     let mask = 1 << (bitsz - 1);
     return num & mask ? num - (1 << bitsz) : num;
   },
   getUInt8: function (buffer) {
     return buffer.at(0);
   },
   getInt8: function (buffer) {
     return this.utoi(this.getUInt8(buffer), 8);
   },
   getUInt16LE: function (buffer) {
     return 0xffff & ((buffer.at(1) << 8) | buffer.at(0));
   },
   getInt16LE: function (buffer) {
     return this.utoi(this.getUInt16LE(buffer), 16);
   },
   getUInt24LE: function (buffer) {
     return (
       0x00ffffff & ((buffer.at(2) << 16) | (buffer.at(1) << 8) | buffer.at(0))
     );
   },
   getInt24LE: function (buffer) {
     return this.utoi(this.getUInt24LE(buffer), 24);
   },
   getBufValue: function (type, buffer) {
     if (buffer.length < getByteSize(type)) return null;
     let res = null;
     if (type === uint8) res = this.getUInt8(buffer);
     if (type === int8) res = this.getInt8(buffer);
     if (type === uint16) res = this.getUInt16LE(buffer);
     if (type === int16) res = this.getInt16LE(buffer);
     if (type === uint24) res = this.getUInt24LE(buffer);
     if (type === int24) res = this.getInt24LE(buffer);
     return res;
   },
   unpack: function (buffer) {
     if (typeof buffer !== 'string' || buffer.length === 0) return null;
     let result = {};
     let _dib = buffer.at(0);
     result['encryption'] = _dib & 0x1 ? true : false;
     result['bthome_version'] = _dib >> 5;
     if (result['bthome_version'] !== 2) return null;
     if (result['encryption']) return result;
     buffer = buffer.slice(1);

     let _bth;
     let _value;
     while (buffer.length > 0) {
       _bth = BTH[buffer.at(0)];
       if (typeof _bth === "undefined") {
         console.log("BTH: Unknown type");
         break;
       }
       buffer = buffer.slice(1);
       _value = this.getBufValue(_bth.t, buffer);
       if (_value === null) break;
       if (typeof _bth.f !== "undefined") _value = _value * _bth.f;

       if (typeof result[_bth.n] === "undefined") {
         result[_bth.n] = _value;
       }
       else {
         if (Array.isArray(result[_bth.n])) {
           result[_bth.n].push(_value);
         }
         else {
           result[_bth.n] = [
             result[_bth.n],
             _value
           ];
         }
       }

       buffer = buffer.slice(getByteSize(_bth.t));
     }
     return result;
   },
 };

 let ShellyBLUParser = {
   getData: function (res) {
     let result = BTHomeDecoder.unpack(res.service_data[BTHOME_SVC_ID_STR]);
     result.model = res.local_name;
     result.addr = res.addr;
     result.rssi = res.rssi;
     return result;
   },
 };

 // PARSE RECEIVED ADVERTISEMENTS
 let last_packet_id = 0x100;
 function parseResult(ev, res) {

   if (ev !== BLE.Scanner.SCAN_RESULT) return;
   if (typeof res.addr === 'undefined' || typeof res.local_name === 'undefined' || typeof res.local_name !== 'string') return;
   if (supported_device.indexOf(res.local_name.substring(0, 5)) === -1) return;
   if (typeof res.service_data === 'undefined' || typeof res.service_data[BTHOME_SVC_ID_STR] === 'undefined') return;

   let BTHparsed = ShellyBLUParser.getData(res);

   if (BTHparsed === null) {
     console.log('Failed to parse BTH data');
     return;
   }

   if (last_packet_id === BTHparsed.pid) return;
   last_packet_id = BTHparsed.pid;

   Shelly.emitEvent('NotifyBluetoothStatus', BTHparsed);
 }

 // START BLE SCAN
 function startBLEScan() {
   let bleScanSuccess = BLE.Scanner.Start({ duration_ms: SCAN_DURATION, active: true }, parseResult);
   if (bleScanSuccess === false) {
     Timer.set(1000, false, startBLEScan);
   } else {
     console.log('Success: Homey Bluetooth Proxy running');
   }
 }

 // CHECK IF BLE IS ENABLED AND START SCAN
 let BLEConfig = Shelly.getComponentConfig('ble');
 if (BLEConfig.enable === false) {
   console.log('Error: BLE not enabled');
 } else {
   Timer.set(1000, false, startBLEScan);
 }`;

  constructor(opts) {
    this.homey = opts.homey;
    this.digests = {};
    this.digests_auth = {};
    this.digest_retries = {};
    this.devicetypes = {
      gen1: false,
      gen2: false,
      gen3: false,
      gen4: false,
      cloud: false,
      bluetooth: false
    }
  }

  /* GENERIC FUNCTION FOR SENDING HTTP COMMANDS */
  async sendCommand(endpoint, address, username, password) {
    try {
      let options = {};
      if (username && password) {
        options = {
          method: 'GET',
          headers: {'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')}
        }
      } else {
        options = {
          method: 'GET'
        }
      }
      return await axios('http://'+ address + endpoint, options)
        .then((response) => {
          return Promise.resolve(response.data);
        })
        .catch(async (error) => {
          if (error.response) {
            return this.checkStatus(error.response);
          } else if (error.request) {
            throw new Error(this.homey.__('util.unreachableerror')+ ' The request was made to http://'+ address + endpoint);
          } else {
            throw new Error(this.homey.__('util.unknownerror'));
          }
        });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sendRpcReboot(type, address, password) {
    this.homey.app.debug('Rebooting device', type, address);
    if (typeof type === 'string' && type.startsWith('SAWD-')) {
      await this.sendRPCCommand('/rpc/Sys.RestartApplication', address, password);
    } else {
      await this.sendRPCCommand('/rpc/Shelly.Reboot', address, password);
    }
  }

  /* GENERIC FUNCTION FOR SENDING HTTP COMMANDS WITH DIGEST AUTHENTICATION FOR GEN2 */
  async sendRPCCommand(endpoint, address, password, requesttype='GET', payload={}) {
    try {
      let options = {}
      if (this.digests_auth[address]) {
        options = {
          method: requesttype,
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.digests_auth[address].authorization(requesttype, endpoint),
          }
        }
      } else {
        options = { method: requesttype }
        if (requesttype !== 'GET') {
          options.headers = {"Content-Type": "application/json"}
        }
      }
      if (Object.keys(payload).length !== 0) {
        options.data = payload;
      }
      if (!this.digest_retries[address]) {
        this.digest_retries[address] = 0;
      }

      this.homey.app.debug('RPC Command', address + endpoint, JSON.stringify(options));

      return await axios('http://'+ address + endpoint, options)
        .then((response) => {
          this.checkStatus(response);
          return Promise.resolve(response.data);
        })
        .catch(async (error) => {
          if (error.response) {
            if (error.response.status === 401) {
              // create digest header for digest authentication
              if (error.response.headers.get("www-authenticate") != undefined && (this.digest_retries[address] <= 2 || this.digest_retries[address] == undefined)) {
                this.digest_retries[address]++;
                const challenges = Auth.parseHeaders(error.response.headers.get("www-authenticate"));
                const auth = Auth.create(challenges);
                auth.credentials("admin", password);
                this.digests_auth[address] = auth;

                // resending command with digest authentication
                options = {
                  method: requesttype,
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.digests_auth[address].authorization(requesttype, endpoint),
                  }
                }
                return await axios('http://'+ address + endpoint, options)
                  .then((response) => {
                    this.digest_retries[address] = 0;
                    return Promise.resolve(response.data);
                  })
                  .catch(async (error) => {
                    if (error.response) {
                      this.checkStatus(error.response);
                      return Promise.resolve(error.response.data);
                    } else if (error.request) {
                      return Promise.reject({"message": this.homey.__('util.404') +' Error: the request failed.'});
                    } else {
                      return Promise.reject({"message": this.homey.__('util.unknownerror') +' Error message: '+ error.message });
                    }
                  });
              }
            } else {
              this.checkStatus(error.response);
              return Promise.resolve(error.response.data);
            }
          } else if (error.request) {
            return Promise.reject({"message": this.homey.__('util.unreachableerror')+ ' The request was made to http://'+ address + endpoint});
          } else {
            return Promise.reject({"message": this.homey.__('util.unknownerror') +' Error message: '+ error.message });
          }

        });

    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* GENERIC FUNCTION FOR CREATING A PAIRED SHELLY COLLECTION - USED TO MATCH INCOMING STATUS UPDATES */
  async getShellies(purpose) {
    try {
      const drivers = Object.values(this.homey.drivers.getDrivers());
      let shellies = [];
      let allActions = [];

      /* retrieve the collection */
      for (const driver of drivers) {
        // Exclude the new Z-Wave and ZigBee drivers from the shelly collection
        if (typeof driver.manifest.zwave !== 'undefined' || typeof driver.manifest.zigbee !== 'undefined') {
          continue;
        }

        const devices = driver.getDevices();
        for (const device of devices) {
          if (purpose === 'collection') {
            if (device.getStoreValue('communication') === 'cloud') {
              this.devicetypes.cloud = true;
            } else if (device.getStoreValue('communication') === 'bluetooth') {
              this.devicetypes.bluetooth = true;
            } else  {
              switch (device.getStoreValue('gen')) {
                case 'gen1':
                  this.devicetypes.gen1 = true;
                  break;
                case 'gen2':
                  this.devicetypes.gen2 = true;
                  break
                case 'gen3':
                  this.devicetypes.gen3 = true;
                  break
                case 'gen4':
                  this.devicetypes.gen4 = true;
                  break
                default:
                  break;
              }
            }
            shellies.push({
              id: device.getData().id,
              name: device.getName(),
              channel: device.getStoreValue('channel'),
              main_device: device.getStoreValue('main_device'),
              gen: device.getStoreValue('gen'),
              communication: device.getStoreValue('communication'),
              device: device
            });
          } else if (purpose === 'flowcard_actions') { /* devices with callbacks for action event trigger card //TODO: eventually remove the flowcard_actions once this deprecated flowcard is completely removed */
            if (device.getStoreValue('config') !== null) {
              const callbacks = device.getStoreValue('config').callbacks;
              if (callbacks.length > 0) {
                let manifest = driver.manifest;
                let tempActions = allActions;
                let device_id = device.getStoreValue('communication') === 'zwave' ? device.getStoreValue('main_device') : device.getData().id;
                allActions = tempActions.concat(callbacks.filter((item) => tempActions.indexOf(item) < 0));
                shellies.push({
                  id: device_id,
                  name: device.getName(),
                  icon: manifest.icon,
                  actions: callbacks
                });
              }
            }
          }
        }
      }

      /* post collection actions based on purpose */
      if (purpose === 'flowcard_actions') {
        shellies = shellies.sort((a, b) => a.name.localeCompare(b.name));
        shellies.unshift({
          id: 'all',
          name: this.homey.__('util.any_device'),
          icon: '/assets/icon.svg',
          actions: allActions
        });
      }

      return Promise.resolve(shellies);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* GENERIC FUNCTION TO RETRIEVE AVAILABLE VIRTUAL COMPONENTS USED IN THE UPDATE VIRTUAL COMPONENT ACTION FLOWCARD */
  async getVirtualComponents(address, password, filter_type) {
    try {
      let virtual_components = [];
      const virtual_components_data = await this.sendRPCCommand('/rpc/Shelly.GetComponents?dynamic_only=true&include=' + encodeURIComponent('["config"]'), address, password);
      virtual_components_data.components.forEach((component) => {
        const type = component.key.substring(0, component.key.length - 4);
        if (filter_type === type || filter_type === 'all') {
          virtual_components.push({
            id: component.key,
            name: component.config.name,
            icon: '/assets/'+ type +'.svg',
            type: type,
            vc_id: component.config.id,
            enum_options: component.config.options || []
          });
        }
      });
      return Promise.resolve(virtual_components);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * COAP RELATED FUNCTIONS
   */

  /* FUNCTION TO ENABLE UNICAST COAP FOR GEN1 DEVICES */
  async setUnicast(address, username, password) {
    try {
      const settings = await this.sendCommand('/settings', address, username, password);
      if (settings.hasOwnProperty("coiot")) {
        if (settings.coiot.hasOwnProperty("peer")) {
          const homey_ip = await getIp(this.homey);
          const result = await this.sendCommand('/settings?coiot_enable=true&coiot_peer='+ homey_ip, address, username, password);
          const reboot = await this.sendCommand('/reboot', address, username, password);
          return Promise.resolve('OK');
        }
      } else if (settings.hasOwnProperty("coiot_execute_enable")) {
          const result = await this.sendCommand('/settings?coiot_execute_enable=true', address, username, password);
          const reboot = await this.sendCommand('/reboot', address, username, password);
          return Promise.resolve('OK');
      } else {
        throw new Error('Device with IP address '+ address +' does not support unicast, make sure you update your Shelly to the latest firmware.');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * WEBSOCKET RELATED FUNCTIONS
   */

  /* FUNCTION TO ADD WEBSOCKET SERVER CONFIG FOR GEN2 DEVICES */
  async setWsServer(type, address, password) {
    try {
      const homey_ip = await getIp(this.homey);
      const config = await this.sendRPCCommand('/rpc/Shelly.GetConfig', address, password);
      if (config.hasOwnProperty("ws")) {
        const payload = '{"id":0, "method":"ws.setconfig", "params":{"config":{"ssl_ca":"*", "server":"ws://'+ homey_ip +':6113/", "enable":true}}}';
        await this.sendRPCCommand('/rpc', address, password, 'POST', payload);
        await this.sendRpcReboot(type, address, password);
        return Promise.resolve('OK');
      } else {
        throw new Error('Device with IP address '+ address +' does not support outbound websocket, make sure you update your Shelly to the latest firmware.');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * CLOUD RELATED FUNCTIONS
   */

  /* FUNCTION FOR CHECKING IF THIS IS A CLOUD INSTALL */
  async getCloudInstall() {
    try {
      const drivers = await Object.values(this.homey.drivers.getDrivers());
      for (const driver of drivers) {
        if (driver.manifest.id.includes('cloud')) {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * BLUETOOTH RELATED FUNCTIONS
   */

  filterBLEDevices(type) {
    if (typeof type === 'string' || type instanceof String) {
      const deviceid = type.substring(0, 5);
      return Util.ble_device_types.includes(deviceid);
    } else {
      return false;
    }
  }

  async sendChunkedScript(script_id, address, password) {
    try {
      const chunks = this.chunkString(Util.ble_script, 1024);
      const numChunks = chunks.length;

      for (let i = 0; i < numChunks; i++) {
        const chunk = chunks[i];
        const shouldAppend = i !== 0;
        const params = JSON.stringify({"id": script_id, "code": chunk, "append": shouldAppend });

        await this.sleep(500);
        await this.sendRPCCommand('/rpc', address, password, 'POST', '{"id":1,"method":"Script.PutCode","params":'+ params +'}');
      }
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  chunkString(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }

    return chunks;
  }

  /* FUNCTION FOR ENABLING BLE EVENT PROXY ON PLUS/PRO */
  async enableBLEProxy(type, address, password) {
    try {

      /* delete current script if present */
      const scripts = await this.sendRPCCommand('/rpc/Script.List', address, password);
      if (scripts.scripts.length > 0) {
        let scriptId = 0;
        for (const script of scripts.scripts) {
          if (script.name === 'Homey BLE Proxy') {
            scriptId = script.id;
          }
        }
        if (typeof scriptId == 'number' && scriptId !== 0) {
          await this.sendRPCCommand('/rpc', address, password, 'POST', '{"id":1,"method":"Script.Delete","params":{"id":'+ Number(scriptId) +'}}');
        }
      }

      /* send script */
      const scriptCreated = await this.sendRPCCommand('/rpc', address, password, 'POST', '{"id":1,"method":"Script.Create","params":{"name":"Homey BLE Proxy"}}');
      await this.sendChunkedScript(scriptCreated.result.id, address, password);
      await this.sendRPCCommand('/rpc/Script.SetConfig?id='+ scriptCreated.result.id +'&config=' + encodeURIComponent('{"enable":true}'), address, password);

      /* check and update Bluetooth settings */
      const checkBluetooth = await this.sendRPCCommand('/rpc/BLE.GetConfig', address, password);
      if (!checkBluetooth.enable) {
        await this.sendRPCCommand('/rpc', address, password, 'POST', '{"id":1,"method":"BLE.SetConfig","params":{"config":{"enable":true,"rpc":{"enable":true},"observer":{"enable":false}}}}');
        await this.sendRpcReboot(type, address, password);
      }

      /* start Homey BLE Proxy script */
      await this.sendRPCCommand('/rpc', address, password, 'POST', '{"id":1,"method":"Script.Start","params":{"id":'+ scriptCreated.result.id +'}}');

      return Promise.resolve(scriptCreated.result.id);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* FUNCTION FOR ENABLING BLE EVENT PROXY ON PLUS/PRO */
  async disableBLEProxy(script_id, address, password) {
    try {
      return await this.sendRPCCommand('/rpc', address, password, 'POST', '{"id":1,"method":"Script.Delete","params":{"id":'+ Number(script_id) +'}}');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * SHELLY X MOD 1 RELATED FUNCTIONS
   */

  async extendCapabilities(settings, capabilities_1, capabilities_2) {
    try {
      let switchCount = 0;
      let inputCount = 0;

      for (let key in settings) {
        if (key === "switch:0") {
          capabilities_1.push('onoff');
          switchCount++;
        } else if (key.startsWith('switch:') && key !== "switch:0") {
          if (!capabilities_2.includes('onoff')) {
            capabilities_2.push('onoff');
          }
          switchCount++;
        }
      }

      for (let key in settings) {
        if (key === "input:0") {
          capabilities_1.push('input_1');
          inputCount++;
        } else if (key.startsWith('input:') && key !== "input:0") {
          if (!capabilities_2.includes('input_1')) {
            capabilities_2.push('input_1');
          }
          inputCount++;
        }
      }

      let channels = Math.max(switchCount, inputCount);

      return Promise.resolve({ capabilities_1, capabilities_2, channels });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * HELPER FUNCTIONS
   */

  /* FUNCTION TO RETRIEVE PROFILES FOR THE SHELLY TRV */
  async getDeviceClasses() {
    try {
      const classes_array = require('homey-lib/assets/device/classes.json');
      const classes = classes_array.map(item => ({
        id: item,
        name: item
      }));
      return Promise.resolve(classes);
    } catch (error) {
      console.error(error);
      const no_classes = [];
      no_classes.push(
        {
          id: "0",
          name: "No device classes found",
        }
      );
      return Promise.resolve(no_classes);
    }
  }

  /* FUNCTION TO RETRIEVE PROFILES FOR THE SHELLY TRV */
  async getTrvProfiles(address, username, password) {
    try {
      const settings = await this.sendCommand('/settings', address, username, password);
      const profiles = [];
      let profile_id = 0;
      profiles.push(
        {
          id: "0",
          name: "Disabled",
        }
      );
      settings.thermostats[0].schedule_profile_names.forEach(profile => {
        profile_id++;
        profiles.push(
          {
            id: profile_id.toString(),
            name: profile,
          }
        )
      });
      return Promise.resolve(profiles);
    } catch (error) {
      const no_profiles = [];
      no_profiles.push(
        {
          id: "0",
          name: "Disabled",
        }
      );
      return Promise.resolve(no_profiles);
    }
  }

  /* FUNCTION FOR UPLOADING A CUSTOM DEVICE ICON */
  uploadIcon(img, id) {
    return new Promise((resolve, reject) => {
      const path = "../userdata/"+ id +".svg";
      const base64 = img.replace("data:image/svg+xml;base64,", '');
      fs.writeFile(path, base64, 'base64', (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(true);
        }
      });
    })
  }

  /* FUNCTION FOR REMOVING A CUSTOM DEVICE ICON */
  removeIcon(iconpath) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(iconpath)) {
          fs.unlinkSync(iconpath);
          return resolve(true);
        } else {
          return resolve(true);
        }
      } catch (error) {
        return reject(error);
      }
    })
  }

  /* HELPER FOR GETTING THE CORRECT ACTION EVENT */
  getActionEventDescription(code, communication, gen) {
    return convertIncomingActionEvent(code, communication, gen);
  }

  /* HELPER FOR GETTING PAIRED DEVICE TYPES, USED TO DETERMINE WHICH SERVICES TO ACTIVATE */
  getDeviceType(type) {
    return this.devicetypes[type];
  }

  /* HELPER FOR GETTING THE CORRECT DEVICE CONFIG */
  getDeviceConfig(device, type = null) {
    this.homey.app.debug('getDeviceConfig', device, type);
    try {
      if (type === null || type === 'hostname') {
        return Util.deviceConfig.find(r => r.hostname.includes(device));
      } else if (type === 'id') {
        return Util.deviceConfig.find(r => r.id === device);
      } else if (type === 'name') {
        return Util.deviceConfig.find(r => r.name.includes(device));
      } else if (type === 'type') {
          return Util.deviceConfig.find(r => r.type.includes(device));
      } else if (type === 'bluetooth') {
        // hack due to silly renaming of model identifiers by Allterco Robotics
        if (device.startsWith('SBBT-EU') || device.startsWith('SBBT-US')) {
          const deviceid = device.substring(0, 7);
          return Util.deviceConfig.find(r => r.type.includes(deviceid));
        } else {
          const bluetoothDevice = Util.deviceConfig.find(r => r.type.includes(device));
          if (bluetoothDevice) {
            return bluetoothDevice;
          }

          // Retry with shorter string
          const deviceid = device.substring(0, 5);
          return Util.deviceConfig.find(r => r.type.includes(deviceid));
        }
      } else {
        return Util.deviceConfig.find(r => r.type.includes(device));
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* HELPER TO NORMALIZE VALUE */
  normalize(value, min, max) {
    var normalized = (value - min) / (max - min);
    return Number(normalized.toFixed(2));
  }

  /* HELPER TO DENORMALIZE VALUE */
  denormalize(normalized, min, max) {
    var denormalized = (normalized * (max - min) + min);
    return Number(denormalized.toFixed(0));
  }

  /* HELPER TO CLAMP VALUE */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /* HELPER TO GET A RANDOM TIMEOUT VALUE */
  getRandomTimeout(max) {
    return (Math.floor(Math.random() * Math.floor(max)) * 1000);
  }

  /* HELPER TO AWAIT A SLEEP VALUE */
  sleep(ms) {
  	return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* HELPER TO COMPARE ARRAYS */
  arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  arr1.sort();
  arr2.sort();
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
  }

  /* FUNCTION FOR RETURNING A CLOUD WEBSOCKET COMMAND */
  websocketMessage(data) {
    try {
      switch(data.event) {
        case 'Integrator:ActionRequest':
          return JSON.stringify({
            event: data.event,
            trid: Math.floor(Math.random() * 999),
            data: { action: 'DeviceVerify', deviceId: data.deviceid }
          });
          break;
        case 'Shelly:CommandRequest':
          return JSON.stringify({
            event: data.event,
            trid: Math.floor(Math.random() * 999),
            deviceId: data.deviceid,
            data: {
              cmd: data.command,
              params: { id: data.channel, [data.command_param]: data.command_value },
            }
          });
          break;
        case 'Shelly:CommandRequest-NoParams':
          return JSON.stringify({
            event: data.event,
            trid: Math.floor(Math.random() * 999),
            deviceId: data.deviceid,
            data: {
              cmd: data.command,
              params: {id: 0}
            }
          });
          break;
        case 'Shelly:CommandRequest-timer':
          return JSON.stringify({
            event: 'Shelly:CommandRequest',
            trid: Math.floor(Math.random() * 999),
            deviceId: data.deviceid,
            data: {
              cmd: data.command,
              params: { id: data.channel, [data.command_param]: data.command_value, [data.timer_param]: data.timer },
            }
          });
        case 'Shelly:CommandRequest-RGB':
          return JSON.stringify({
            event: 'Shelly:CommandRequest',
            trid: Math.floor(Math.random() * 999),
            deviceId: data.deviceid,
            data: {
              cmd: data.command,
              params: { id: data.channel, red: data.red , green: data.green, blue: data.blue },
            }
          });
          break;
        case 'Shelly:CommandRequest-WhiteMode':
          return JSON.stringify({
            event: 'Shelly:CommandRequest',
            trid: Math.floor(Math.random() * 999),
            deviceId: data.deviceid,
            data: {
              cmd: data.command,
              params: { id: data.channel, gain: data.gain , white: data.white },
            }
          });
          break;
        default:
          return JSON.stringify({
            event: "Integrator:ActionRequest",
            trid: Math.floor(Math.random() * 999),
            data: { action: 'DeviceVerify', id: data.deviceid }
          });
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* FUNCTION FOR CHECKING THE STATUS FOR REGULAR HTTP COMMANDS */
  checkStatus = (res) => {
    if (res !== undefined) {
      if (res.status === 200) {
        return res;
      } else {
        switch (res.status) {
          case 400:
            throw new Error(this.homey.__('util.400') +' Error message: '+ res.statusText);
          case 401:
          case 403:
            throw new Error(this.homey.__('util.401') +' Error message: '+ res.statusText);
          case 404:
            throw new Error(this.homey.__('util.404') +' Error message: '+ res.statusText);
          case 500:
            throw new Error(this.homey.__('util.500') +' Error message: '+ res.statusText);
          case 502:
          case 504:
            throw new Error(this.homey.__('util.502') +' Error message: '+ res.statusText);
          default:
            throw new Error(res.status+': '+ this.homey.__('util.unknownerror') +' Error message: '+ res.statusText);
        }
      }
    }
  }

}

module.exports = Util;
