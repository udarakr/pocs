/*
 * preMapFunction stub:
 *
 * The name of the function can be changed to anything you like.
 *
 * The function will be passed one 'options' argument that has the following fields:
 *   'data' - an array of records representing the page of data before it has been mapped.  A record can be an object {} or array [] depending on the data source.
 *   '_importId' - the _importId currently running.
 *   '_connectionId' - the _connectionId currently running.
 *   '_flowId' - the _flowId currently running.
 *   '_integrationId' - the _integrationId currently running.
 *   'settings' - all custom settings in scope for the import currently running.
 *
 * The function needs to return an array, and the length MUST match the options.data array length.
 * Each element in the array represents the actions that should be taken on the record at that index.
 * Each element in the array should have the following fields:
 *   'data' - the modified/unmodified record that should be passed along for processing.
 *   'errors' -  used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: '' }
 * Returning an empty object {} for a specific record will indicate that the record should be ignored.
 * Returning both 'data' and 'errors' for a specific record will indicate that the record should be processed but errors should also be logged.
 * Throwing an exception will fail the entire page of records.
 */
function preMap(options) {
    return options.data.map((d) => {
      var organizer = getOraganizer(d.organizer, d.records);
      var organizerInternalId = organizer ? organizer.internalId : "7664";
      //remove the selected organizer from attendees
      var attendees = d.attendees;
      if (organizer) {
        for (var i = 0; i < attendees.length; i++) {
          if (attendees[i].email === organizer.email) {
            attendees.splice(i, 1);
          }
        }
      }
  
      var attendeelist = getAttendees(organizer, attendees, d.records);
  
      return {
        data: {
          title: d.title,
          accessLevel: d.accessLevel,
          organizer: organizerInternalId,
          startdate: d.startDate,
          starttime: d.startTime,
          enddate: d.endDate,
          endtime: d.endTime,
          status: d.status,
          externalid: d.externalId,
          message: d.message,
          attendees: d.attendees,
          attendeelist: attendeelist,
          location: d.location,
        },
      };
    });
  }
  
  var recArrray = [
    "employee",
    "contact",
    "customer",
    "vendor",
    "lead",
    "prospect",
    "partner",
    "job",
  ];
  
  function getOraganizer(email, records) {
    for (var record of records) {
      if (record.recordType === recArrray[0] && record.email === email) {
        return record;
      }
    }
  
    return null;
  }
  
  function getAttendees(organizer, attendees, records) {
      var attendeeArray = [];
      if(organizer){
          attendeeArray.push({
            internalId : organizer.internalId,
            response : "ACCEPTED"
          });
      }
      for (var attendee of attendees) {
        var attendeeMap = {};
        for (var record of records) {
          if (record.email === attendee.email) {
            var skipAttendeeResponse = attendee.response.toUpperCase() === "NORESPONSE";
            attendeeMap[record.recordType] = {
              internalId : record.internalId,
              response : skipAttendeeResponse ? null : attendee.response.toUpperCase()
            };
          }
        }
        for (var recordType of recArrray) {
          if (attendeeMap[recordType]) {
            attendeeArray.push(attendeeMap[recordType]);
            break;
          }
        }
      }
      return attendeeArray;
    }