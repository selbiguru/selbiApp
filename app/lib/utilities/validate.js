/**
 * @class Validate
 */
var _ = require((typeof ENV_TEST === 'boolean') ? 'alloy' : 'underscore')._;


/**
 * @method validate Method to validate any variable/object
 * @param {Object} value
 * @param {Object} options
 */
function validate(value, options) {
    options = _.defaults(options || {}, {
       trim: true,
       required: true,
       label: 'Value'
    });
    
    if (_.isObject(value)) {
        
        if (typeof value.value === 'string') {
            
            if (value.hintText) {
                options.label = value.hintText;
            }
            
            value = value.value;
            
        } else {
            var values = {};

            _.each(_.keys(value), function (key) {
                var keyOptions, keyValue;
                
                if (_.isArray(value[key])) {
                    keyValue = value[key][0];
                    keyOptions = _.defaults(value[key][1] || {}, options);
                    
                } else {
                    keyValue = value[key];
                    keyOptions = _.clone(options);
                }
                
                values[key] = validate(keyValue, keyOptions);
                
                return;
            });
            
            return values;
        }
    }
   
    if (typeof value === 'string' && options.trim) {
        value = value.trim();
    }
    
    delete options.trim;

    if (options.required && _.isEmpty(value)) {
        throw String.format(L('validate_required', '%s is required.'), options.label);
    }
    
    delete options.required;
    
    var error;
    
    _.each(options, function (setting, key) {
        if (setting === false) {
            return;
        }

        switch (key) {
            
            case 'email':
                var email = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}$/i;
                if (!email.test(value)) return error = {message: String.format(L('validate_email', '%s is not an email address.'), options.label)};
                break;
                
            case 'regexp':
                if (!setting.test(value)) return error = {message: String.format(L('validate_regexp', '%s is not valid'), options.label)};
                break;
                
            case 'numeric':
                if (!_.isFinite(value)) return error = {message: String.format(L('validate_numeric', '%s is not a number.'), options.label)};
                break;
        }
        return;
    });
        
    return error? error : value;
}

if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = validate;
        }
        exports.validate = validate;
}