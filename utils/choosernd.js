exports.chooseRnd = function chooseRnd(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
