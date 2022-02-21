const csvParser = require('csv-parser');
const csvWriter = require('csv-writer');
const fs = require('fs');

const result = {};
fs.createReadStream('boosted.csv')
    .pipe(csvParser())
    .on('data', row => {
        const project = row['Project name'], date = row['Date'], str = row['Duration'].split(':');
        const durationMinutes = parseInt(str[0]) * 60 + parseInt(str[1]) + parseInt(str[2]) / 60;
        result[date] = result[date] || {};
        result[date][project] = durationMinutes + (result[date][project] || 0);
    })
    .on('end', () => {
        const data = Object.keys(result).map((key) => ([
            key,
            result[key]['Reading'] || 0,
            result[key]['Listening'] || 0,
            result[key]['Writing'] || 0,
            result[key]['Speaking'] || 0,
            result[key]['Anki'] || 0,
            result[key]['Grammar'] || 0,
        ]));
        const writer = csvWriter.createArrayCsvWriter({
            path: 'boostedMap.csv',
        });
        writer.writeRecords(data)
            .then(() => console.log('CSV file successfully processed'));
    })