module.exports = getDate;
//module.exports.getDate = getDate;
function getDate() {
    let today = new Date();
    
    let options = {
        weekday: "long",
        year: "numeric",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleString("en-US", options);
}

// // jika ada dua fungsi
// module.exports.getDay = getDay;
// function getDay() {
//     let today = new Date();
    
//     let options = {
//         weekday: "long"
//     };
//     let day = today.toLocaleString("en-US", options);
//     return day;
// }
