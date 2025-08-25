//@OnlyCurrentDoc

function updateSelectedAssetTags() {

  // START customization
  var api_baseurl = 'https://your-url/api/v1';  // fully qualified url to the base api - should end in /v1, no trailing slash"
  var api_bearer_token = 'Bearer YOUR-BEARER-TOKEN';  // should start with "Bearer "
  // END customization

  var sheet = SpreadsheetApp.getActive();
  var data = sheet.getDataRange().getValues();
  let i = 1;

  data.forEach(function (row) {

    if (i > 1)  {

      // assign variables by their column
      let user_id = Math.floor(row[0]);
      let new_username = row[1];
      let url = api_baseurl + '/users/' + row[0];

      var options = {
        method: 'patch',
        muteHttpExceptions: true,
        headers: {
          Accept: 'application/json',
          Authorization: api_bearer_token,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify(
          {
            username: new_username,
          }),
      };

      // Make the http request and collect and parse the response
      var response = UrlFetchApp.fetch(url, options);
      var response_msg = JSON.parse(response.getContentText());

      Logger.log('User ID: ' + user_id + ' - new username should be ' + new_username);
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
      sheet.getRange("C" + Math.floor(i)).setValue(response_msg.messages).setBackground(status_color);

    }
    i++;

    // This is used for very large imports so as not to exceed API throttle limits
    Utilities.sleep(1000);

  });
  // end foreach
}