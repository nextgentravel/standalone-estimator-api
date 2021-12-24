let sendEmailEstimateCeres = require('./function');

module.exports = async function (context, req) {
  let response = await sendEmailEstimateCeres(req);

  console.log(response)

  return {
    body: JSON.stringify(response),
    status: response.statusCode,
  };
}
