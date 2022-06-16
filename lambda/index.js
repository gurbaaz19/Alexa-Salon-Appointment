/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// const AWS = require("aws-sdk");
// const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

var name = null;
var phone = null;
var date = null;
var time =null;

var servicesArray = Array(13).fill(0);
servicesArray[1]=-1;//Service Dropped

const L=[
    "Hair Wash",
    null,
    "Skin Care Special Plan",
    "Face Care Special Plan",
    "Hair Care Special Plan",
    "Nail Care Special Plan",
    "Hair Straightening",
    "Hair Cut",
    "Threading",
    "Pedicure",
    "Manicure",
    "Waxing",
    "Facial",
    "Bleach"];
    
const SerivcesAvailableSpeak="We offer: "+L[0]+", "+L[7]+", "+L[6]+", "+L[8]+", "+L[9]+", "+L[10]+", "+L[11]+", "+L[12]+", "+L[13]+
". We are also offering some exciting combo plans for our services, with special discounts, these include: "+L[2]+" including Waxing, Facial and Bleach, "+L[3]+" including only Facial and Bleach, "+L[4]+" including Hair Wash and Hair Cut, "+L[5]+" including pedicure and manicure.";              

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Serenity Salon !!! To begin with please tell us your name and mobile number.';
        const cardTitle = `Welcome to Serenity Salon !!!`;
        const cardContent = "Please tell us your name and mobile number";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, cardContent)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CustomerAuthenticationIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "CustomerAuthenticationIntent"
    );
  },
  handle(handlerInput) {
    const slotNames = handlerInput.requestEnvelope.request.intent.slots;
    name = slotNames.Name.value;
    phone = slotNames.Phone.value;
    const speakOutput = `Welcome ${name}. We are pleased to serve you, please let us know when are you free to enjoy our services. `;
    const cardTitle = `Welcome ${name}`;
    const cardContent = "Please give a date to book your appointment.";

    return handlerInput.responseBuilder
    .speak(speakOutput)
     .withSimpleCard(cardTitle, cardContent)
    .addDelegateDirective({
                name: 'DateIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
      .getResponse();
  }
};

const DateIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "DateIntent"
    );
  },
  handle(handlerInput) {
    const slotNames = handlerInput.requestEnvelope.request.intent.slots;
    date = slotNames.date.value;
    const speakOutput ="Great, what time on "+"<say-as interpret-as='date'>"+date+"</say-as>"+" suits you.";
    const cardTitle = `Appointment for ${date}`;
    const cardContent = "Please choose a time to make an appointment";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(cardTitle, cardContent)
    .addDelegateDirective({
                name: 'TimeIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
      .getResponse();
  }
};

const TimeIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "TimeIntent"
    );
  },
  handle(handlerInput) {
    const slotNames = handlerInput.requestEnvelope.request.intent.slots;
    time = slotNames.time.value;
    const speakOutput ="Great, I can book an Appointment for "+"<say-as interpret-as='time'>"+time+"</say-as> on "+"<say-as interpret-as='date'>"+date+"</say-as>"+". "+SerivcesAvailableSpeak;
    const cardTitle = `Appointment for ${time} on ${date}`;
    const cardContent = SerivcesAvailableSpeak;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(cardTitle, cardContent)
    .addDelegateDirective({
                name: 'BookServiceIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
      .getResponse();
  }
};


const BookServiceIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "BookServiceIntent"
    );
  },
  handle(handlerInput) {
    const slotNames = handlerInput.requestEnvelope.request.intent.slots;
    var services = slotNames.services.slotValue.values;
    
    services.forEach((item)=>{
        servicesArray[item.resolutions.resolutionsPerAuthority[0].values[0].value.id]=1;
    });
    for(var i=0;i<3;i++){
    if(servicesArray[0]===1 && servicesArray[7]===1){
        servicesArray[4]=1;
    }
    if(servicesArray[12]===1 && servicesArray[13]===1 && servicesArray[11]===0){
        servicesArray[3]=1;
    }
    if(servicesArray[9]===1 && servicesArray[10]===1){
        servicesArray[5]=1;
    }
    if(servicesArray[11]===1 && servicesArray[13]===1 && servicesArray[12]===1){
        servicesArray[2]=1;
    }
    
    if(servicesArray[11]===1){
        servicesArray[3]=0;
    }
    
    if(servicesArray[4]===1){
        servicesArray[0]=1;
        servicesArray[7]=1;
    }
    
    if(servicesArray[3]===1){
        servicesArray[12]=1;
        servicesArray[13]=1;
    }
    
    if(servicesArray[5]===1){
        servicesArray[9]=1; 
        servicesArray[10]=1;
    }
    
    if(servicesArray[2]===1){
        servicesArray[11]=1;
        servicesArray[13]=1;
        servicesArray[12]=1;
    }
    
    }
    
    let servicesAvailed="";
    let comboAvailed="";
    
    for(let i=2;i<6;i++){
        if(servicesArray[i]===1){
            comboAvailed=comboAvailed+", "+L[i];
        }
    }
    
    if(servicesArray[0]===1){
        servicesAvailed=servicesAvailed+", "+L[0];
    }
    
        for(let i=6;i<14;i++){
        if(servicesArray[i]===1){
            servicesAvailed=servicesAvailed+", "+L[i];
        }
    }
    
    var speakOutput = "You have booked "+servicesAvailed;
    
    if(comboAvailed!==""){
        speakOutput=speakOutput+" and you are entitled to Special Combo discounts under "+comboAvailed;
    }
    
    const cardTitle = "Services Booked:";
    const cardContent = speakOutput;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(cardTitle, cardContent)
      .addDelegateDirective({
                name: 'ConfirmBookingIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
      .getResponse();
  }
};

const ConfirmBookingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmBookingIntent';
    },
    handle(handlerInput) {
        const speakOutput = "We have booked your Appointment for "+date+" "+time+". A confirmation would be sent to "+"<say-as interpret-as='digits'>" +phone+ "</say-as>"+". Hope to see you soon!!!";
        const cardTitle = "Thankyou, "+name;
        const cardContent = "We have booked your Appointment for "+date+" "+time+". A confirmation would be sent to " +phone+". Hope to see you soon!!!";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(cardTitle, cardContent)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CustomerAuthenticationIntentHandler,
        DateIntentHandler,
        TimeIntentHandler,
        BookServiceIntentHandler,
        ConfirmBookingIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();