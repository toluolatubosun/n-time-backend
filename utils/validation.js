const Joi = require('@hapi/joi')

// Sign Up validation
const signupValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(70)
            .required(),
        email: Joi.string()
            .min(6)
            .max(70)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    })
    return schema.validate(data)
}

// login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .max(70)
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    })
    return schema.validate(data)
}

// Create Space Validation
const createSpaceValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(50)
            .required(),
        startDateTime: Joi.string()
            .required(),
        venue: Joi.string()
            .min(6)
            .max(150)
            .required()
    })
    return schema.validate(data)
}

// Update Space Validation
const updateSpaceValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(50)
            .required(),
        spaceCode: Joi.string()
            .length(8)
            .required(),
        venue: Joi.string()
            .min(6)
            .max(150)
            .required(),
        startDateTime: Joi.string()
            .required(),
        state: Joi.number()
            .required()
    })
    return schema.validate(data)
}

// Join / Space Data Validation
const spaceValidation = (data) => {
    const schema = Joi.object({
        spaceCode: Joi.string()
            .length(8)
            .required()
    })
    return schema.validate(data)
}


module.exports = {
    loginValidation,
    signupValidation,
    createSpaceValidation,
    updateSpaceValidation,
    spaceValidation
}