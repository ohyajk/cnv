const fs = require("fs")

function parseTxtToJson(filename) {
    const data = []
    try {
        const fileContent = fs.readFileSync(filename, "utf-8")
        const lines = fileContent.split(/\r?\n/)

        // Skip the header line
        lines.shift()

        for (const line of lines) {
            const flareData = line.trim().split(/\s+/)

            // Check if all required data is present
            if (flareData.length !== 13) {
                console.warn(`Warning: Line '${line}' has unexpected data format`)
                continue
            }

            // Convert data to appropriate types
            let startTime, peakIntensity, totalCounts, sunward
            try {
                startTime = parseFloat(flareData[1])
                peakIntensity = parseFloat(flareData[4])
                totalCounts = parseFloat(flareData[6])
                sunward = parseFloat(flareData[8])
            } catch (error) {
                console.warn(`Warning: Line '${line}' contains invalid numerical data`)
                continue
            }

            // Create a dictionary for the flare entry
            const flareEntry = {
                Flare: flareData[0],
                "Start time (s)": startTime,
                "Peak (c/s)": peakIntensity,
                "End (s)": flareData[2],
                "Duration (s)": flareData[3],
                "Peak Counts": flareData[5],
                "Total Counts": totalCounts,
                "Sunward Flux": sunward,
                Trigger: flareData[7],
                "RHESSI Flare #": flareData[9],
                Detectors: flareData[10],
            }

            data.push(flareEntry)
        }
    } catch (error) {
        console.error(`Error reading file: ${error}`)
    }

    return data
}

function saveToJson(data, outputFilename) {
    try {
        fs.writeFileSync(outputFilename, JSON.stringify(data, null, 4))
    } catch (error) {
        console.error(`Error saving JSON data: ${error}`)
    }
}

// Example usage
const inputFilename = "./data.txt"
const outputFilename = "data.json"

const parsedData = parseTxtToJson(inputFilename)
saveToJson(parsedData, outputFilename)

console.log(`Successfully parsed data and saved to ${outputFilename}`)
