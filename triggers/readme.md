Useful util:
https://tableconvert.com/excel-to-json

0. Be sure not to have changes to publish in GTAG container
1. Export JSON from GTAG, replace contents of gtmExport.json
2. Replace contents of elementsIds.json, useful util https://tableconvert.com/excel-to-json
3. run generateTriggers.js
4. gtmImport.json is updated, import it into GTAG, use it to merge changes with current workspace


Use at your own risk, keep a backup of the original workspace just in case.


elementsIds.json example:

[
  {
      "id": "section-element-button"
  }
]