const AWS = require('aws-sdk');
const fs = require('fs');
const parse = require('csv-parse/sync').parse
const path = require('path')
const alasql = require('alasql')
const { DateTime, Interval, Info } = require('luxon') 

const inputData = fs.readFileSync(path.resolve(__dirname, 'rates.csv'), 'utf8');

function getRateForDate(date, ratesInRange) {
    let givenDate = new Date(date)
    let givenDateAdjusted = new Date(givenDate.getTime() + Math.abs(givenDate.getTimezoneOffset() * 60000));
    for (let rate of ratesInRange.slice().reverse()) {
        let rateDate = new Date(rate.start_date);
        let rateDateAdjusted = new Date(rateDate.getTime() + Math.abs(rateDate.getTimezoneOffset() * 60000));

        if (Date.parse(rateDateAdjusted) <= Date.parse(givenDateAdjusted)) {
            return {
                date,
                rate,
            }
        }
    }
    return null;
}

const calculatorRatesForRange = (departureDate, returnDate, rates) => {
    
  departureDate = DateTime.fromISO(departureDate)
  returnDate = DateTime.fromISO(returnDate)

  let dates = Interval.fromDateTimes(
      departureDate.startOf("day"),
      returnDate.endOf("day"))
      .splitBy({days: 1}).map(d => d.start.toISODate())

  // remove the last date, since we won't need accommodation on that day

  dates.pop();

  let result = []

  for (const date in dates) {
    result.push(getRateForDate(dates[date], rates));
  }

  return result;
}

module.exports = async function (req) {
    let body = req.body

    let place = {
        city: body.city,
        province: body.province,
    }

    let data = await parse(inputData, { columns: ['year','start_date','city','province','country_english','country_french','country_code','max_rate','currency_code'] });
    let ratesInRange = await alasql(`SELECT * FROM ? WHERE city = ? AND province = ? ORDER BY start_date`, [data, place.city, place.province]);
    let dates = {
        start: body.startDate,
        end: body.endDate,
    }

    let result = calculatorRatesForRange(dates.start, dates.end, ratesInRange)

    return {
        body: result,
    }
}
