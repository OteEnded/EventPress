import file_sys from 'fs';
import path from 'path';
import config from '@root/config.json';

export function readJSONFile(filePath){
    log("projectutility[readJSONFile]: Reading JSON file from", filePath)
    try {
        const jsonData = file_sys.readFileSync(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        log("projectutility[readJSONFile]: Data from", filePath, "can be read successfully and will be return.")
        return data
    } catch (err) {
        console.error('projectutility[readJSONFile]: ERROR, cannot read file from', filePath);
        console.error(err);
        return null
    }
}

export function getConfig(is_log){
    if (is_log !== false) log("projectutility[getConfig]: Getting config data:")
    try {
        const configData = config
        if (is_log !== false) log("projectutility[getConfig]: ☆★ CONFIG DATA IS GOTTEN! ★☆.")
        // console.log(configData)
        return configData
    }
    catch (err) {
        console.error('projectutility[getConfig]: ERROR, cannot get config data.')
        console.error(err)
        return err
    }
}

export function getRandomIntInRange(min = null, max = null){
    if (min == null) return Math.random();
    if (max == null){
        max = min
        min = 0
    }
    if(min > max){
        [min, max] = [max, min]
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (file_sys.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    file_sys.mkdirSync(dirname);
}

export async function log(...args) {
    try {

        // Get the current date
        const currentDate = new Date().toLocaleDateString();

        // Get the current time
        const currentTime = "" + currentDate + " " + new Date().toLocaleTimeString();

        // Combine all log arguments into a single string
        const logMessage = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');

        // Ensure the log directory exists
        ensureDirectoryExistence('./log/local.log');

        // Append the log message with the current time to a text file
        file_sys.appendFileSync('./log/local.log', `[${currentTime}] ${logMessage}\n`);

        // Log the message with the current time to the console
        console.log(`[${currentTime}] ${logMessage}`);
    }
    catch (err) {
        console.error('projectutility[log]: ERROR, cannot log message to file');
        console.error(err);
        console.log(...args);
    }
};

export function objLen(obj){
    return Object.keys(obj).length;
}

export function getDBConnectionConfig() {
    const configData = getConfig();
    const databaseConfig = configData["database"];

    log("dbconnector[getDBConnectionConfig]: Validating database connection config ->") //, configData);

    if (!databaseConfig || !databaseConfig.hasOwnProperty("connections")) {
        throw new Error("dbconnector[getDBConnectionConfig]: ABORT, invalid database config.");
    }

    const connectionInUse = databaseConfig["connection_in_use"];
    const dbConfig = databaseConfig["connections"][connectionInUse];

    if (!dbConfig) {
        throw new Error(`dbconnector[getDBConnectionConfig]: ABORT, connection '${connectionInUse}' not found in connections.`);
    }

    const requiredProperties = ["user", "password", "database", "host"];
    for (const property of requiredProperties) {
        if (!dbConfig.hasOwnProperty(property)) {
            throw new Error(`dbconnector[getDBConnectionConfig]: ABORT, missing property '${property}' in connection '${connectionInUse}'`);
        }
    }

    log("dbconnector[getDBConnectionConfig]: Validation passed.");
    return dbConfig;
}

export default {
    readJSONFile,
    getConfig,
    // getConfigAsRoot,
    getRandomIntInRange,
    ensureDirectoryExistence,
    log,
    objLen,
    getDBConnectionConfig
};