exports.handler = function(context, event, callback) {
    
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE);

    if (event.RecordingStatus === 'completed'){

        base('jobs').select({
            filterByFormula: `{callsid} = "${event.CallSid}"`
          }).eachPage(function page(records, fetchNextPage) {

            records.forEach(function(record) {
                
                base('jobs').update([
                    {
                        "id": record.id,
                        "fields": {
                            "recording": event.RecordingUrl,
                            "duration" : parseInt(event.RecordingDuration)
                        }
                    }
                    ], function(err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
                
                callback(null, record.id);
            });

          });

    }
}