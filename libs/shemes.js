const valueScheme = require("value-schema");
/**
 * Validation Schemes used by 'value-schema'
 */
module.exports = {
    createVoteData: {
        name: valueScheme.string().minLength(3, true),
        data: valueScheme.array().separatedBy("\n").minLength(2, true),
        is_agreement: valueScheme.string().only("on")
    }
}