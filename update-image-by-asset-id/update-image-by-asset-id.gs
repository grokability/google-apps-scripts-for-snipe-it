/*
-----------------------------------------------------
=====================================================
                      SETUP
Assumes your Asset Id's starts in column A2 and its
corresponding image URL in column B.

Example:
       A             B
1   ASSET ID  |  IMAGE URL
2      1      |  http://example.com/image.jpg
3      2      |  http://example.com/image2.jpg

** Only tested on images with .jpg file extension  **
=====================================================
-----------------------------------------------------
*/

function updateSelectedAssetTags() {

 // START customization  ============================
    var api_baseurl = 'https://your-url/api/v1'; // fully qualified url to the base api - should end in /v1, no trailing slash"
    var api_bearer_token = 'Bearer YOUR-BEARER-TOKEN'; // should start with "Bearer "
// END customization    =============================

    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var lastRow = sheet.getLastRow();

    // Get the range for columns A and B
    var range = sheet.getRange("A2:B" + lastRow);

    // Get the values from the range
    var data = range.getValues();

    let i = 0;

    data.forEach(function(row) {

        if (i > 1) {

            let asset_id = Math.floor(row[0]);
            let imageUrl = row[1];
            let url = api_baseurl + '/hardware/' + asset_id;

            var base64 = convertBase64(imageUrl)

            var options = {
                method: 'patch',
                muteHttpExceptions: true,
                headers: {
                    Accept: 'application/json',
                    Authorization: api_bearer_token,
                    'Content-Type': 'application/json',
                },
                payload: JSON.stringify({
                    image: base64,
                }),
            };

            // Make the http request and collect and parse the response
            var response = UrlFetchApp.fetch(url, options);
            var response_msg = JSON.parse(response.getContentText());

            Logger.log('Payload: ' + options.payload);
            Logger.log('Endpoint: ' + url);
            Logger.log('Row Array: ' + row);
            Logger.log('HTTP Response Code: ' + response.getResponseCode());
            Logger.log('Messages: ' + response_msg.messages);

            if ((response.getResponseCode() === 200) && (response_msg.status == 'success')) {
                var status_color = '#b6d7a8';
            } else {
                var status_color = '#f4cccc';
            }
            // Put the status in the third column for each row
            sheet.getRange("C" + Math.floor(i)+1).setValue(response_msg.messages).setBackground(status_color);
        }
        i++;

        // This is used for very large imports so as not to exceed API throttle limits
        Utilities.sleep(1000);

    });
    // end foreach
}

//Encodes jpg to base64
function convertBase64(imageUrl) {
    const blob = UrlFetchApp.fetch(imageUrl).getBlob();
    const base64String = Utilities.base64Encode(blob.getBytes());
    return `data:image/jpg;base64,${base64String}`;
};
