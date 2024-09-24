import fs from 'fs';
import gtmExport from './gtmExport.json' assert { type: 'json' }
import elementsIds from './elementIds.json' assert { type: 'json' }

let accountId = gtmExport.containerVersion.accountId;
let containerId = gtmExport.containerVersion.containerId;

let fingerprints = gtmExport.containerVersion.trigger.map((trigger) => parseInt(trigger.fingerprint));
let triggerIds = gtmExport.containerVersion.trigger.map((trigger) => parseInt(trigger.triggerId));

let maxTriggerFingerprint = Math.max(...fingerprints);
let maxtTiggerId = Math.max(...triggerIds);



elementsIds.forEach(element => {
  
  maxtTiggerId = maxtTiggerId +1;
  maxTriggerFingerprint = maxTriggerFingerprint +1;

  gtmExport.containerVersion.trigger.push(
      {
        "accountId": accountId,
        "containerId": containerId,
        "triggerId": maxtTiggerId.toString(),
        "name": "Click - " + element.id,
        "type": "CUSTOM_EVENT",
        "customEventFilter": [
            {
                "type": "EQUALS",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "arg0",
                        "value": "{{_event}}"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "arg1",
                        "value": "gtm.click"
                    }
                ]
            }
        ],
        "filter": [
            {
                "type": "EQUALS",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "arg0",
                        "value": "{{data-analyticsid}}"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "arg1",
                        "value": element.id
                    }
                ]
            }
        ],
        "fingerprint": maxTriggerFingerprint.toString()
    }
  );
});







var json = JSON.stringify(gtmExport);
fs.writeFileSync('gtmImport.json', json, 'utf8');
console.log("done");

