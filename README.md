# boosted-reformat

## Usage

First thing you will need to do to use this tool is download or clone this project from [Github](https://github.com/david-allan-jones/boosted-reformat). Then you will need to install Node, which you can do [here](https://nodejs.dev/download/).

Once the project is downloaded, cd into the root of the project and run `npm install`. There are some dependencies the package needs to work with csvs and parse arguments from the CLI.

Once everything is installed, you simply need to use Node to run the index.js file in this package. There are 2 requirement arguments, the input file path (default name is boosted.csv when exported from the application) and a desired output file path (whatever you want).

Examples:

`node index.js boosted.csv report.csv`

`node index.js boosted.csv report.csv -u h`

`node index.js boosted.csv report.csv -h`

`node index.js boosted.csv report.csv -u s -h`

### Flags

| Flag | Valid Values | Description | Default Value |
| - | - | - | - |
| -u | s, m, h | Specifies the unit of time to compile to in the output. (s=seconds, m=minutes, h=hours) | m |
| -h | Boolean | When true, writes a header row in the top of the output csv that clarifies the order of projects for each subsequent row | false |

## Contact

If you would like to contact the author, please visit https://www.davidjonesdev.com/contact and leave a message via the contact form there.