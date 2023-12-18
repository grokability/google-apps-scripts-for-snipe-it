//@OnlyCurrentDoc

function insertNewUsers() {

  // START customization
    var api_baseurl = 'https://your-url/api/v1';  // fully qualified url to the base api - should end in /v1, no trailing slash"
    var api_bearer_token = 'Bearer YOUR-BEARER-TOKEN';  // should start with "Bearer "
  // END customization

  var sheet = SpreadsheetApp.getActive();
  var data = sheet.getDataRange().getValues();
  let i = 1;

  data.forEach(function (row) {

    if (i > 1)  {

      let first_name = row[0];
      let last_name = row[1];
      let email = row[2];
      let username = row[3];
      let password = row[4];
      let password_confirmation = row[4];
      let notes = row[5];
      let url = api_baseurl + '/users';

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
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            notes: notes,
          }),
      };

      // Make the http request and collect and parse the response
      var response = UrlFetchApp.fetch(url, options);
      var response_msg = JSON.parse(response.getContentText());

      Logger.log('Endpoint: ' + url);
      Logger.log('Row Array: ' +  row);
      Logger.log('HTTP Response Code: ' + response.getResponseCode());



      if ((response.getResponseCode() === 200) && (response_msg.status == 'success')) {
        var status_color = '#b6d7a8';
      } else {

        response_msg.messages = parseValidationErrors(response_msg.messages);
        var status_color = '#f4cccc';

      }

      // Put the status in the third column for each row
      sheet.getRange("G" + Math.floor(i)).setValue(response_msg.messages).setBackground(status_color);

    }
    i++;

    // This is used for very large imports so as not to exceed API throttle limits
    Utilities.sleep(1000);

  });
  // end foreach
}

function parseValidationErrors(messages) {

      let validation_msg = '';
      for (var i in messages) {
        Logger.log('Error: ' + messages[i]);
        validation_msg +=  messages[i];

        if (i.length <  messages.length ) {
          validation_msg += ', ';
        }
      }

      return validation_msg;
}