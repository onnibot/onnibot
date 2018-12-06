exports.calcDays = function(date1, date2) {

    // The number of milliseconds in one day
    var oneDay = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1Ms = date1.getTime()
    var date2Ms = date2.getTime()

    // Calculate the difference in milliseconds
    var differenceMs = Math.abs(date1Ms - date2Ms)

    // Convert back to days and return
    return Math.round(differenceMs/oneDay)
};
