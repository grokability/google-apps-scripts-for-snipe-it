//@OnlyCurrentDoc

function auditSelectedAssetTags() {

  // START customization
  var api_baseurl = 'https://your-url/api/v1';  // fully qualified url to the base api - should end in /v1, no trailing slash"
  var api_bearer_token = 'Bearer YOUR-BEARER-TOKEN';  // should start with "Bearer "
  // END customization

  var sheet = SpreadsheetApp.getActive();
  var data = sheet.getDataRange().getValues();
  let i = 1;

  data.forEach(function (row) {

    if (i > 1)  {

      let asset_tag = row[0];
      let note = row[1];
      let next_audit_date = row[2];
      let url = api_baseurl + '/hardware/audit/';

      var options = {
        method: 'post',
        muteHttpExceptions: true,
        headers: {
          Accept: 'application/json',
          Authorization: api_bearer_token,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify(
          {
            asset_tag: asset_tag,
            note: note,
            next_audit_date: next_audit_date,
          }),
      };

      // Make the http request and collect and parse the response
      var response = UrlFetchApp.fetch(url, options);
      var response_msg = JSON.parse(response.getContentText());

      Logger.log('Asset: ' + asset_tag + ' has been audited with the note: ' + note);
      Logger.log('Payload: ' + options.headers.payload);
      Logger.log('Endpoint: ' + url);
      Logger.log('Row Array: ' +  row);
      Logger.log('HTTP Response Code: ' + response.getResponseCode());
      Logger.log('Messages: ' + response_msg.messages);

      if ((response.getResponseCode() === 200) && (response_msg.status == 'success')) {
        var status_color = '#b6d7a8';
      } else {
         var status_color = '#f4cccc';
      }

      // Put the status in the third column for each row
      sheet.getRange("D" + Math.floor(i)).setValue(response_msg.messages).setBackground(status_color);

    }
    i++;

    // This is used for very large imports so as not to exceed API throttle limits
    Utilities.sleep(1000);

  });
  // end foreach
}