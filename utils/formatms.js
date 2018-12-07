exports.formatMs =  function(ms) {
  let seconds = parseInt((ms/1000)%60);
  let minutes = parseInt((ms/(1000*60))%60);
  let hours = parseInt((ms/(1000*60*60))%24);
  let days = parseInt((ms/(1000*60*60*24))%30);

  // Days, hours, minutes and seconds formatted (add day/hour/minute/second tag),
  // remove value if needed
  days = days ? `${days} day${addS(days)}` : ""
  hours = hours ? `${hours} hour${addS(hours)}`: ""
  minutes = minutes ? `${minutes} minute${addS(minutes)}` : ""
  seconds = seconds || (!days && !hours && !minutes && !seconds) ? `${seconds} second${addS(seconds)}` : ""

  // Let's make an array of them - if they are empty, remove them with .filter(Boolean)
  // Then join them together
  return [days, hours, minutes, seconds].filter(Boolean).join(", ");
};

function addS (int) {
  return int === 1 ? "" : "s"
}
