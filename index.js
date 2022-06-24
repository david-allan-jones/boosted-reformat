const csvParser = require('csv-parser');
const csvWriter = require('csv-writer');
const fs = require('fs');

const result = {};

const input = process.argv[2];

const inputErrors = [];
if (input === undefined) {
    inputErrors.push('Please provide an input filepath to a boosted csv export.')
}
const output = process.argv[3];
if (output === undefined) {
    inputErrors.push('Please provide an output filepath following the input argument.')
}

if (inputErrors.length > 0) {
    inputErrors.forEach((err) => console.error(err));
    process.exit(1);
}

console.info(`Opening read stream of ${input}...`);

const readStream = fs.createReadStream(input)
readStream.pipe(csvParser())
    .on('data', row => {
        const project = row['Project name'], date = row['Date'], str = row['Duration'].split(':');
        const durationMinutes = parseInt(str[0]) * 60 + parseInt(str[1]) + parseInt(str[2]) / 60;
        result[date] = result[date] || {};
        result[date][project] = durationMinutes + (result[date][project] || 0);
    })
    .on('end', () => {
        console.info('Finished parsing input. Preparing result for output.');
        const data = Object.keys(result).map((date, index) => {
            if (index === 0) {
                console.info(`Order of values is Date followed by ${Object.keys(result[date]).join(', ')}`)
            }

            minutes = Object.keys(result[date]).map(project => result[date][project] || 0)
            return [
                date,
                ...minutes
            ]
        });
        const writer = csvWriter.createArrayCsvWriter({
            path: output,
        });
        console.info(`Writing output to ${output}...`);
        writer.writeRecords(data)
            .then(() => console.info('Finished writing output.'));
    })
    .on('close', () => {
        console.info(`Closed read stream of ${input}.`)
    })