const csvParser = require('csv-parser');
const csvWriter = require('csv-writer');
const fs = require('fs');
const yargs = require('yargs/yargs');

args = yargs(process.argv.slice(2)).argv

const result = {};

const input = args._[0];
const inputErrors = [];
if (input === undefined) {
    inputErrors.push('Please provide an input filepath to a boosted csv export.')
}
const output = args._[1];
if (output === undefined) {
    inputErrors.push('Please provide an output filepath following the input argument.')
}

const UNITS_WHITELIST = ['s', 'm', 'h']
const units = args.u || 'm'
if (!UNITS_WHITELIST.includes(units)) {
    inputErrors.push('Invalid units provided. Please use one of the following. s=seconds, m=minutes, h=hours');
}

if (inputErrors.length > 0) {
    inputErrors.forEach((err) => console.error(err));
    process.exit(1);
}

console.info(`Opening read stream of ${input}...`);

const readStream = fs.createReadStream(input)
const projectOrder = { currentIndex: -1, projects:{} }
readStream.pipe(csvParser())
    .on('data', row => {
        const project = row['Project name'], date = row['Date'], str = row['Duration'].split(':');
        if (projectOrder.projects[project] === undefined) {
            projectOrder.projects[project] = ++projectOrder['currentIndex'];
        }
        let unitDivisor
        switch (units) {
            case 's': unitDivisor = 1; break;
            case 'm': unitDivisor = 60; break;
            case 'h': unitDivisor = 3600; break;
        }
        const duration = (parseInt(str[0]) * 3600 + parseInt(str[1]) * 60 + parseInt(str[2])) / unitDivisor;
        result[date] = result[date] || {};
        result[date][project] = duration + (result[date][project] || 0);
    })
    .on('end', () => {
        console.info('Finished parsing input. Preparing result for output.');
        console.info(`Order of output values is Date, ${Object.keys(projectOrder.projects).join(', ')}`);

        const header = args.h
            ? ['Date', ...Object.keys(projectOrder.projects).sort((a, b) => {
                return projectOrder.projects[a] < projectOrder.projects[b] ? -1 : 1;
            })]
            : [];

        const orderObjectArray = require('./order-object-array');
        const data = [header, ...Object.keys(result).map(date => {
            minutes = Object.keys(result[date]).map(project => result[date][project] || 0);
            return [
                date,
                ...orderObjectArray(result[date], projectOrder.projects, 0)
            ]
        })];
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