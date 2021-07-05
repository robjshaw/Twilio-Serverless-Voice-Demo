exports.handler = function(context, event, callback) {
    
    const twilioClient = context.getTwilioClient();

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE);

    var result = {};

    // event.jobid + event.client

    base('jobs').select({
        filterByFormula: `{jobid} = ${event.jobid}`
    }).eachPage(function page(records, fetchNextPage) {
    
        records.forEach(function(record) {

            result.found = 1;
            result.job_notes = record.get('job_notes')
            result.to = record.get('customer')
            result.tradie_client = record.get('tradie_client')
            result.customer = record.get('customer')
            result.active = record.get('active')
            result.conversation_id = record.get('conversation_id')
            result.job_phonenumber = record.get('job_phonenumber')
            result.jobid = record.id

            if (result.job_phonenumber === undefined){

                // TODO - create conv

                result.setup = 1;

                base('numbers').select({
                    filterByFormula: `{in_use} = 0`
                }).eachPage(function page(records, fetchNextPage) {
                
                    records.forEach(function(record) {
            
                        result.job_phonenumber = record.get('phonenumber');
                        
                        base('numbers').update([
                            {
                              "id": record.id,
                              "fields": {
                                "in_use": true,
                                "jobid" : [result.jobid]
                              }
                            }
                          ], function(err, records) {
                            if (err) {
                              console.error(err);
                              return;
                            }
                            records.forEach(function(record) {
                              console.log(record.get('Created'));
                            });
                        });

                        base('jobs').update([
                            {
                              "id": result.jobid,
                              "fields": {
                                "job_phonenumber": result.job_phonenumber
                              }
                            }
                          ], function(err, records) {
                            if (err) {
                              console.error(err);
                              return;
                            }
                        });

                        callback(null, result);
                    });
                    
                }, function done(err) {
                    if (err) { console.error(err); return; }
                });
            }else{
                result.setup = 0;
                callback(null, result); 
            }   
        });
        
    }, function done(err) {
        if (err) { console.error(err); return; }
    });


}