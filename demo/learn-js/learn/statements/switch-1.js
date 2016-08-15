//Fall thru

function getLang(countryCode) {
  var lang = "";
  switch(countryCode) {
    case "US":
      lang += "Spanish,French,";
    case "UK":
      lang += "English";
      break;

    default:
      lang += "Unknown";
      break;
  }
  return lang;
}

console.log( getLang("US") );

console.log( getLang("UK") );

console.log( getLang("HK") );