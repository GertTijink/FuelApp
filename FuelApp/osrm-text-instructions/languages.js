
// Create a list of supported codes
var instructions = {
    'nl': instructionsNl,
};


var supportedCodes = Object.keys(instructions);
var parsedSupportedCodes = Object.keys(instructions).map(function(language) { return parseLanguageIntoCodes(language); });

function parseLanguageIntoCodes (language) {
    var match = language.match(/(\w\w)(?:-(\w\w\w\w))?(?:-(\w\w))?/i);
    var locale = [];
    if (match[1]) {
        match[1] = match[1].toLowerCase();
        locale.push(match[1]);
    }
    if (match[2]) {
        match[2] = match[2][0].toUpperCase() + match[2].substring(1).toLowerCase();
        locale.push(match[2]);
    }
    if (match[3]) {
        match[3] = match[3].toUpperCase();
        locale.push(match[3]);
    }
    return {
        locale: locale.join('-'),
        language: match[1],
        script: match[2],
        region: match[3]
    };
}