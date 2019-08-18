module.exports = class FormHelper {
    /**
     * constructor
     * @param req
     * @constructor
     */
    constructor(req) {
        this.req = req;
    }

    /**
     * Get value in session
     * @param {String} name tag name
     */
    getValueInSession(name) {
        if (!this.req.session.form[name]) {
            return;
        }
        return this.req.session.form[name];
    }

    /**
     * Get form error class `is-danger`
     * @param {String} name tag name
     */
    getErrorClass(name) {
        if (this.isError(name)) {
            return 'is-danger';
        }
    }

    /**
     * Detect errors
     * @param {String} name tag name
     */
    isError(name) {
        if (!this.req.session.errorMessages) {
            return;
        }
        let isErrorExists = this.req.session.errorMessages.find(x => x == name);
        if (isErrorExists) {
            return true;
        }
    }
}