var langName = "  Javascript  ";

function updateLang(langName){
  console.log("inside updateLang: [" + langName + "]");
  langName = langName.trim();
}

updateLang("Java ");

console.log("Outside: [" + langName + "]");
