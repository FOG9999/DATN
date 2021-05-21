module.exports = {
  turnStringsToRegex: (strings) => {
    let output = ".*" + strings[0];
    if (strings.length > 1) {
      for (let i = 1; i < strings.length; i++) {
        output += `.*${strings[i]}`;
      }
    }
    return new RegExp(output + ".*", "i");
  },
};
