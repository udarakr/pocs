/**
 * Sends emails with data from the current spreadsheet.
 */
function doGet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow = 2; // First row of data to process
  var numRows = 1; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 3);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var time = Utilities.formatDate(new Date(), "IST", "MM-dd-yyyy HH:mm:ss");
  for (var i in data) {
    var row = data[i];
    var emailAddress = row[0]; // First column
    var subject = row[1] + "-" + time;
    var message = row[2];
    MailApp.sendEmail(emailAddress, subject, message);
  }
}
