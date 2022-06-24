const csvParser = require('csv-parser');
const csvWriter = require('csv-writer');
const fs = require('fs');

const result = {};

const input = process.argv[2];
const output = process.argv[3];

console.info(`Beginning parse of ${input}...`);
fs.createReadStream(input)
    .pipe(csvParser())
    .on('data', row => {
        const project = row['Project name'], date = row['Date'], str = row['Duration'].split(':');
        const durationMinutes = parseInt(str[0]) * 60 + parseInt(str[1]) + parseInt(str[2]) / 60;
        result[date] = result[date] || {};
        result[date][project] = durationMinutes + (result[date][project] || 0);
    })
    .on('end', () => {
        console.info('Finished parsing input. Preparing result for output.');
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
            path: output,
        });
        console.info(`Writing output to ${output}...`);
        writer.writeRecords(data)
            .then(() => console.info('CSV file successfully processed'));
    })