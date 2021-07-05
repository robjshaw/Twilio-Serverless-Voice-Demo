exports.handler = function(context, event, callback) {
    
    const twilioClient = context.getTwilioClient();

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE);

    var result = {};

    base('jobs').select({
        filterByFormula: `{customer} = "${event.from}"`
    }).eachPage(function page(records, fetchNextPage) {
    
        records.forEach(function(record) {

            result.found = 1;
            result.job_notes = record.get('job_notes')
            result.to = record.get('customer')
            result.tradie_client = record.get('tradie_client')
            result.tradie_phonenumber = record.get('tradie')
            result.customer = record.get('customer')
            result.active = record.get('active')
            result.conversation_id = record.get('conversation_id')
            result.job_phonenumber = record.get('job_phonenumber')
            result.jobid = record.id

            result.setup = 0;
            callback(null, result);  
        });
        
    }, function done(err) {
        if (err) { console.error(err); return; }
    });


}