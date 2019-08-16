const appRoot = require('app-root-path');
const fileSystem = require('fs');
const path = require('path');
/**
 * constructor
 * @param {String} id
 * @returns void
 * @constructor
 */
module.exports = class VoteData {
    constructor (id) {
        this._id = id;
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
        if (targetIndex > 0) {
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
        return path.join(appRoot.path, 'data', this._id.slice(0, 2), this._id.slice(3, 5), this._id);
    }
}