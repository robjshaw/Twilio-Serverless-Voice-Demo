# Why?
This takes the original Twilio QuickStart, makes it serverless to allow you to make and receive calls to the PSTN.

It has as Airtable backend to know what number to call to and from.  It also stitches the call recording back to the record.

## A couple of quick configs
This is the .env file
```
ACCOUNT_SID= "available in the twilio console"
AUTH_TOKEN= "available in the twilio console"
BASE_URL= "your ngrok"
API_KEY= "see below"
API_SECRET= "see below"
TWIML_APPLICATION_SID= "see below"
AIRTABLE_KEY= "https://airtable.com/api"
AIRTABLE_BASE= "https://airtable.com/api"
```

API_KEY & API_SECRET can be created here:-  https://www.twilio.com/console/project/api-keys

TWIML_APPLICATION_SID can be created here - https://www.twilio.com/console/voice/twiml/apps

* Create an APP and update the Request URL (POST) to your local server less environment https://YOUR_NGROK.ngrok.io/client-voice-twiml-app

## Let’s spin it up
Ensure you have Twilio Serverless Toolkit and CLI installed

```
# 1) install the cli
npm install -g twilio-cli

# 2)
twilio plugins:install @twilio-labs/plugin-serverless

# 3) You need a account SID and auth token to get started.
twilio login
```

You should be good to go

```
npm install
npm start
```

You should be presented with 

```
Twilio functions available:                                                  │
│   ├── /accept_outgoing | http://localhost:3000/accept_outgoing                 │
│   ├── /call_events | http://localhost:3000/call_events                         │
│   ├── /client-voice-twiml-app | http://localhost:3000/client-voice-twiml-app   │
│   ├── /get_job | http://localhost:3000/get_job                                 │
│   ├── /voice-token | http://localhost:3000/voice-token                         │
│   └── /get_job_phonenumber | http://localhost:3000/get_job_phonenumber         │
│                                                                                │
│   Twilio assets available:                                                     │
│   ├── /index.html | http://localhost:3000/index.html                           │
│   ├── /quickstart.js | http://localhost:3000/quickstart.js                     │
│   ├── /url_reader.js | http://localhost:3000/url_reader.js                     │
│   └── /style.css | http://localhost:3000/style.css                             │
│                                                       
```

Just go to index.html and your webrtc phone should be good to go!