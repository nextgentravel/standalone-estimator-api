const AWS = require('aws-sdk');
var Intl = require('intl');
const prismicData = require('./prismic-email-notifications.json')
const prismicKeywords = require('./prismic-email-keywords.json')
// Note: you only need to require the locale once
require('intl/locale-data/jsonp/en-CA.js');
require('intl/locale-data/jsonp/fr-CA.js');

var frenchNumberFormat = Intl.NumberFormat('fr-CA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'symbol'
});

var englishNumberFormat = Intl.NumberFormat('en-CA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'symbol'
});

const addCommaToPlaceName = (placeName) => {
  console.log(placeName)
  let province = placeName.slice(-2)
  let cityName = placeName.slice(0, -3)
  return `${cityName}, ${province}`
}

const localCurrencyDisplay = (string, locale) => {
  if (locale === 'en-CA') {
    return englishNumberFormat.format(string).replace('CA', '').replace(/\D00(?=\D*$)/, '')
  } else if (locale === 'fr-CA') {
    return frenchNumberFormat.format(string).replace('CA', '').replace(/\D00(?=\D*$)/, '')
  }
}

const travelCategory = (input, lang) => {
  if (lang === 'en') {
    return input;
  } else if (lang === 'fr') {
    switch (input) {
      case prismicKeywords.travelCategories.en[0]:
        return prismicKeywords.travelCategories.fr[0]
        break;
        case prismicKeywords.travelCategories.en[1]:
          return prismicKeywords.travelCategories.fr[1]
        break;
        case prismicKeywords.travelCategories.en[2]:
          return prismicKeywords.travelCategories.fr[2]
        break;
        case prismicKeywords.travelCategories.en[3]:
          return prismicKeywords.travelCategories.fr[3]
        break;
      case prismicKeywords.travelCategories.en[4]:
        return prismicKeywords.travelCategories.fr[4]
        break;
      default:
        return input;
    }
  }
}

const travelMode = (input, lang) => {
  if (lang === 'en') {
    console.log(input)
    switch (input) {
      case 'flight':
        return prismicKeywords.travelMode.en.flight
        break;
      case 'train':
        return prismicKeywords.travelMode.en.train
        break;
      case 'rental':
        return prismicKeywords.travelMode.en.rental
        break;
      case 'private':
        return prismicKeywords.travelMode.en.privatevehicle
        break;
      case 'notrequired':
        return prismicKeywords.travelMode.en.notrequired
        break;
      default:
        return input;
    }
  } else if (lang === 'fr') {
    switch (input) {
      case 'flight':
        return prismicKeywords.travelMode.fr.flight
        break;
      case 'train':
        return prismicKeywords.travelMode.fr.train
        break;
      case 'rental':
        return prismicKeywords.travelMode.fr.rental
        break;
      case 'private':
        return prismicKeywords.travelMode.fr.privatevehicle
        break;
      case 'notrequired':
        return prismicKeywords.travelMode.fr.notrequired
        break;
      default:
        return input;
    }
  }
}

const accommodationType = (input, lang) => {
  if (lang === 'en') {
    switch (input) {
      case 'hotel':
        return prismicKeywords.accommodationType.en.hotel
        break;
      case 'private':
        return prismicKeywords.accommodationType.en.private
        break;
      case 'notrequired':
        return prismicKeywords.accommodationType.en.notrequired
        break;
      default:
        return input;
    }
  } else if (lang === 'fr') {
    switch (input) {
      case 'hotel':
        return prismicKeywords.accommodationType.fr.hotel
        break;
      case 'private':
        return prismicKeywords.accommodationType.fr.private
        break;
      case 'notrequired':
        return prismicKeywords.accommodationType.fr.notrequired
        break;
      default:
        return input;
    }
  }
}

module.exports = async function (requestBody) {

    let body = requestBody.body

    const injectTemplateLiterals = (data) => {
      data = data.split('${body.travellersName}').join(`${body.travellersName}`)
      data = data.split('${body.approversName}').join(`${body.approversName}`)
      data = data.split('${body.tripName}').join(`${body.tripName}`)
      data = data.split("${travelCategory(body.travelCategory, 'fr')}").join(`${travelCategory(body.travelCategory, 'fr')}`)
      data = data.split("${travelCategory(body.travelCategory, 'en')}").join(`${travelCategory(body.travelCategory, 'en')}`)
      data = data.split("${body.travellerIsPublicServant ? 'Oui' : 'Non'}").join(`${body.travellerIsPublicServant ? 'Oui' : 'Non'}`)
      data = data.split("${body.travellerIsPublicServant ? 'Yes' : 'No'}").join(`${body.travellerIsPublicServant ? 'Yes' : 'No'}`)
      data = data.split("${addCommaToPlaceName(body.origin.acrdName)}").join(`${addCommaToPlaceName(body.origin.acrdName)}`)
      data = data.split("${addCommaToPlaceName(body.destination.acrdName)}").join(`${addCommaToPlaceName(body.destination.acrdName)}`)
      data = data.split("${body.departureDate}").join(`${body.departureDate}`)
      data = data.split("${body.returnDate}").join(`${body.returnDate}`)
      data = data.split("${accommodationType(body.accommodationType, 'fr')}").join(`${accommodationType(body.accommodationType, 'fr')}`)
      data = data.split("${accommodationType(body.accommodationType, 'en')}").join(`${accommodationType(body.accommodationType, 'en')}`)
      data = data.split("${localCurrencyDisplay(body.accommodationCost, 'fr-CA')}").join(`${localCurrencyDisplay(body.accommodationCost, 'fr-CA')}`)
      data = data.split("${localCurrencyDisplay(body.accommodationCost, 'en-CA')}").join(`${localCurrencyDisplay(body.accommodationCost, 'en-CA')}`)
      data = data.split("${travelMode(body.transportationType, 'fr')}").join(`${travelMode(body.transportationType, 'fr')}`)
      data = data.split("${travelMode(body.transportationType, 'en')}").join(`${travelMode(body.transportationType, 'en')}`)
      data = data.split("${localCurrencyDisplay(body.transportationCost, 'fr-CA')}").join(`${localCurrencyDisplay(body.transportationCost, 'fr-CA')}`)
      data = data.split("${localCurrencyDisplay(body.transportationCost, 'en-CA')}").join(`${localCurrencyDisplay(body.transportationCost, 'en-CA')}`)
      data = data.split("${localCurrencyDisplay(body.localTransportationCost, 'fr-CA')}").join(`${localCurrencyDisplay(body.localTransportationCost, 'fr-CA')}`)
      data = data.split("${localCurrencyDisplay(body.localTransportationCost, 'en-CA')}").join(`${localCurrencyDisplay(body.localTransportationCost, 'en-CA')}`)
      data = data.split("${localCurrencyDisplay(body.mealCost, 'fr-CA')}").join(`${localCurrencyDisplay(body.mealCost, 'fr-CA')}`)
      data = data.split("${localCurrencyDisplay(body.mealCost, 'en-CA')}").join(`${localCurrencyDisplay(body.mealCost, 'en-CA')}`)
      data = data.split("${localCurrencyDisplay(body.otherCost, 'fr-CA')}").join(`${localCurrencyDisplay(body.otherCost, 'fr-CA')}`)
      data = data.split("${localCurrencyDisplay(body.otherCost, 'en-CA')}").join(`${localCurrencyDisplay(body.otherCost, 'en-CA')}`)
      data = data.split("${localCurrencyDisplay(body.summaryCost, 'fr-CA')}").join(`${localCurrencyDisplay(body.summaryCost, 'fr-CA')}`)
      data = data.split("${localCurrencyDisplay(body.summaryCost, 'en-CA')}").join(`${localCurrencyDisplay(body.summaryCost, 'en-CA')}`)
      data = data.split("${body.tripNotes}").join(`${body.tripNotes}`)
      data = data.split("${body.travellersEmail}").join(`${body.travellersEmail}`)

      return data
    }

    const SESConfig = {
        apiVersion: '2010-12-01',
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
        region: process.env.AWS_SES_REGION
    };
    
    let confirmationParams = {
      Source: 'GC Travel Calculator / Calculateur de voyage du GC <tpsgc.nepasrepondre-donotreply02.pwgsc@tpsgc-pwgsc.gc.ca>',
      Destination: {
        ToAddresses: [
          body.travellersEmail
        ]
      },
      ReplyToAddresses: ['tpsgc.nepasrepondre-donotreply02.pwgsc@tpsgc-pwgsc.gc.ca'],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: 
              `${injectTemplateLiterals(prismicData.message_to_traveller_en)}

              ---

              <br /><br />
              ${injectTemplateLiterals(prismicData.message_to_traveller_fr)}
              `
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${prismicData.traveller_message_subject_en} / ${prismicData.traveller_message_subject_fr}`
        }
      }
    };

    let supervisorParams = {
      Source: 'GC Travel Calculator / Calculateur de voyage du GC <tpsgc.nepasrepondre-donotreply02.pwgsc@tpsgc-pwgsc.gc.ca>',
      Destination: {
        ToAddresses: [
          body.approversEmail
        ]
      },
      ReplyToAddresses: ['tpsgc.nepasrepondre-donotreply02.pwgsc@tpsgc-pwgsc.gc.ca'],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: 
              `${injectTemplateLiterals(prismicData.message_to_approver_en)}

              ---

              <br /><br />
              ${injectTemplateLiterals(prismicData.message_to_approver_fr)}
              `
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${prismicData.approver_message_subject_en} / ${prismicData.approver_message_subject_fr}`,
        }
      }
    };

    let initialResult = body.initialResult;

    let applicableRates = body.applicableRates.map((rate => {
      return `${rate.month}: ${rate.rate}`
    }))

    let csvLineObject = {
      origin: body.origin.acrdName,
      destination: body.destination.acrdName,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      applicableACRDRates: applicableRates.join(' '),
      privateVehicleRateCents: body.privateVehicleRate,
      accommodationCostEstimated: initialResult.accommodationCost,
      accommodationCostSubmitted: body.accommodationCost,
      accommodationTypeEstimated: initialResult.accommodationType,
      accommodationTypeSubmitted: body.accommodationType,
      transportationCostEstimated: initialResult.transportationCost,
      transportationCostSubmitted: body.transportationCost,
      transportationTypeEstimated: initialResult.transportationType,
      transportationTypeSubmitted: body.transportationType,
      returnDistanceEstimatedMeters: initialResult.returnDistance,
      returnDistanceSubmittedKilometres: body.privateKilometricsValue,
      localTransportationCostEstimated: initialResult.localTransportationCost,
      localTransportationCostSubmitted: body.localTransportationCost,
      mealCostEstimated: initialResult.mealCostTotal,
      mealCostSubmitted: body.mealCost,
      otherCostEstimated: initialResult.otherCost,
      otherCostSubmitted: body.otherCost,
      summaryCostEstimated: initialResult.summaryCost,
      summaryCostSubmitted: body.summaryCost,
      mealCost: body.mealCost,
      breakfast: initialResult.mealCost.breakfast,
      lunch: initialResult.mealCost.lunch,
      dinner: initialResult.mealCost.dinner,
      incidentals: initialResult.mealCost.incidentals,
      objective: body.tripName,
      category: travelCategory(body.travelCategory, 'en'),
      publicServant: body.travellerIsPublicServant ? 'Yes' : 'No',
      notes: body.tripNotes,
      flightEstimateMinimum: body.flightResult.minimum,
      flightEstimateMedian: body.flightResult.median,
      flightEstimateMaximum: body.flightResult.maximum,
    }

    let csvHeaders = Object.keys(csvLineObject);
    let csvData = csvHeaders.map(key => `"${csvLineObject[key]}"`).join(',')

    let response = {
      approver: '',
      traveller: '',
    }

    await new AWS.SES(SESConfig)
      .sendEmail(confirmationParams)
      .promise()
      .then((res) => {
          response.traveller = "Email sent to traveller"
      })
      .catch((err) => {
          console.log('err: ', err)
          response.traveller = err;
      });

    await new AWS.SES(SESConfig)
      .sendEmail(supervisorParams)
      .promise()
      .then((res) => {
        console.log('res: ', res)
        response.approver = "Email sent to approver"
      })
      .catch((err) => {
        console.log('err: ', err)
        response.approver = err;
      });

}
