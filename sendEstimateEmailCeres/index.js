let sendEmailEstimateCeres = require('./function');

module.exports = async function (context, req) {
  let response = sendEmailEstimateCeres(req);
  context.res = {
    body: JSON.stringify(response)
  };
}
