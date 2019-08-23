const appRoot = require('app-root-path');
const crypto = require('crypto');
const fileSystem = require('fs');
const path = require('path');
/**
 * VoteData Class
 * @type {module.VoteData}
 */
module.exports = class VoteData {
    /**
     * constructor
     * @param {String} id
     * @returns void
     * @constructor
     */
    constructor (id = null) {
        if (id) {
            this.id = id;
        } else {
            this.id = this.generateId();
        }
    }

    /**
     * Sanitize the vote data.
     * @param {Object} req request
     */
    sanitizeData(req) {
        let sanitizedData = {};
        for (let key in req.body) {
            if (typeof(req.body[key]) === 'string') {
                sanitizedData[key] = req.sanitize(req.body[key]);
            }
        }
        return sanitizedData;
    }

    /**
     * Sort the vote data.
     * @return {Object}
     */
    sortData() {
        return this.voteData().sort(function(a,b){
            if( a.count > b.count ) return -1;
            if( a.count < b.count ) return 1;
            return 0;
        });
    }

    /**
     * Get the vote data.
     */
    voteData() {
        return this.data()._voteData;
    }

    /**
     * Get a name of data
     */
    name() {
        return this.data().name;
    }

    /**
     * vote
     * @param {String} key
     * @return void
     */
    vote(key) {
        let data = this.data();
        if (!data._voteData) {
            data._voteData = [];
        }
        let targetIndex = data._voteData.findIndex((data) => {
            return data.key === key;
        });
        if (targetIndex >= 0) {
            data._voteData[targetIndex].count++;
        } else {
            data._voteData.push({
                'key': key,
                'count': 1
            });
        }
        // Write result
        fileSystem.writeFileSync(this.filePath(), JSON.stringify(data), function (err) {
            if (err) {
                throw err;
            }
        });
    }

    /**
     * Get the data.
     * @returns {Object}
     */
    data() {
        return JSON.parse(fileSystem.readFileSync(this.filePath(), {encoding: "utf-8"}));
    }

    /**
     * Get a path of voting data
     * @returns {string}
     */
    filePath() {
        return path.join(appRoot.path, 'data', this.id.slice(0, 2), this.id.slice(3, 5), this.id);
    }

    /**
     * Generate id
     * @return {String} id
     */
    generateId() {
        // Generate file name;
        let hrTime = process.hrtime();
        // Not reuse digest
        //  ref. https://stackoverflow.com/questions/44855529/using-crypto-node-js-library-unable-to-create-sha-256-hashes-multiple-times-in
        let sha1Hash = crypto.createHash('sha1').update(hrTime[1] + crypto.randomBytes(4)).digest('hex');
        return sha1Hash;
    }
}