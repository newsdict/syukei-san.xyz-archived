const fileSystem = require('fs');
const path = require('path');
const voteData = require('./vote_data.js');
/**
 * Clean Class
 * @type {module.CleanData}
 */
module.exports = class CleanData {
    /**
     * clean the data file
     * @param findPath
     * @returns {Array}
     */
    clean(findPath) {
        fileSystem.readdir(findPath, (err, files) => {
            files.filter(file => {
                const stat = fileSystem.statSync(path.join(findPath, file));
                if (err) {
                    throw err;
                }
                if (stat.isFile()) {
                    const voteDataInstance = new voteData(file);
                    if (voteDataInstance.isExpire()) fileSystem.unlink(path.join(findPath, file), (err) => {
                        if (err) throw err;
                    });
                } else if (stat.isDirectory()) {
                    this.clean(path.join(findPath, file));
                } else {
                    throw 'unknown file: ' + path.join(findPath, file);
                }
            });
        });
    }
}