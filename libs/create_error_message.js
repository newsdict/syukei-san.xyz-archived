/**
 * Error Handling class for Form
 * @type {module.CreateErrorMessage}
 */
module.exports = class CreateErrorMessage {
    /**
     * constructor
     * @param {String} key Message key of error object.
     * @returns void
     * @constructor
     */
    constructor(key) {
        this.key = key;
        this.errors = [];
    }

    /**
     * Add error
     * @param {Object} error Error object of 'value-schema'.
     * @return void
     */
    add(error) {
        if (error) {
            this.errors.push(error);
        }
    }

    /**
     * Get error messages
     * @return {String}
     */
    getMessages() {
        return this.errors.map(x => new Array(x[this.key]).join());
    }
}