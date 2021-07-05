exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();

  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE);

  console.log(event.To);

  if (event.To) {

    base('jobs').select({
      // filterByFormula: `${query}`
      filterByFormula: `{customer} = "${event.To}"`
    }).eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {

        console.log(event.CallSid);

        base('jobs').update([
          {
            "id": record.id,
            "fields": {
              "callsid": event.CallSid
            }
          }
        ], function(err, records) {
          if (err) {
            console.error(err);
            return;
          }
        });

        const attr = isAValidPhoneNumber(event.To) ? "number" : "client";

        const dial = twiml.dial({
          answerOnBridge: true,
          callerId: record.get('job_phonenumber'),
          record: 'record-from-answer',
          recordingStatusCallback: process.env.BASE_URL + '/call_events'
        });
        // twiml.start().stream({ url: 'wss://' +  process.env.BASE_URL + 'listen'});

        dial[attr]({}, event.To);
        
        callback(null, twiml);

      }, function done(err) {
        if (err) { console.error(err); return; }
      });

    }, function done(err) {
      if (err) { console.error(err); return; }
    });
  } else {
    twiml.say("Thanks for calling!");
    callback(null, twiml);
  }
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
