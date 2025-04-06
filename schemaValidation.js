const Joi = require('joi');

const listingSchema = Joi.object({
    list : Joi.object({
        title : Joi.string()
                   .required(),
        description : Joi.string()
                         .required(),
        image : Joi.string()
                   .allow("", null),
        price : Joi.number()
                   .required()
                   .min(0),
        location : Joi.string()
                      .required(),
        country : Joi.string()
                     .required()
    }).required()
});


const  reviewSchema  =  Joi.object({
    review : Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        comments : Joi.string().required()
    }).required()
});

module.exports = {listingSchema, reviewSchema};