import fs from 'fs';
import gtmExport from './gtmExport.json' assert { type: 'json' }
import tagsData from './tagsData.json' assert { type: 'json' }
import { nanoid } from 'nanoid'


let accountId = gtmExport.containerVersion.accountId;
let containerId = gtmExport.containerVersion.containerId;

let fingerprints = gtmExport.containerVersion.tag.map((tag) => parseInt(tag.fingerprint));
let tagsIds = gtmExport.containerVersion.tag.map((tag) => parseInt(tag.tagId));

let maxFingerprint = Math.max(...fingerprints);
let maxTagId = Math.max(...tagsIds);



tagsData.forEach(element => {
  
  maxTagId = maxTagId +1;
  maxFingerprint = maxFingerprint +1;
  let trigger = gtmExport.containerVersion.trigger.find((trigger) => trigger.name == element.trigger);

  if(trigger){

    let objToPush = {
      "accountId": accountId,
      "containerId": containerId,
      "tagId": maxTagId.toString(), 
      "name": "ce - ga4 - " + element.event_name + " - " + nanoid(6),
      "type": "gaawe",
      "parameter": [
          {
              "type": "BOOLEAN",
              "key": "sendEcommerceData",
              "value": "false"
          },
          {
              "type": "BOOLEAN",
              "key": "enhancedUserId",
              "value": "false"
          },
          {
              "type": "TEMPLATE",
              "key": "eventName",
              "value": element.event_name
          },
          {
              "type": "TEMPLATE",
              "key": "measurementIdOverride",
              "value": element.gaproperty
          }
      ],
      "fingerprint": maxFingerprint.toString(),
      "firingTriggerId": [
        trigger.triggerId
      ],
      "tagFiringOption": "ONCE_PER_EVENT",
      "paused": true,
      "monitoringMetadata": {
          "type": "MAP"
      },
      "consentSettings": {
          "consentStatus": "NOT_SET"
      }
    };


    if( element.property && element.value  ){
      objToPush.parameter.push({
        "type": "LIST",
        "key": "eventSettingsTable",
        "list": [
            {
                "type": "MAP",
                "map": [
                    {
                        "type": "TEMPLATE",
                        "key": "parameter",
                        "value": element.property
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "parameterValue",
                        "value": element.value
                    }
                ]
            }
        ]
      });
    }

    gtmExport.containerVersion.tag.push(objToPush);

  }else{
    console.log("No se encontro: " + element.trigger + "para tag event: " + element.event_name);
  }

});


var json = JSON.stringify(gtmExport);
fs.writeFileSync('gtmImport.json', json, 'utf8');
console.log("done");
