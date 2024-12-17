import Joi from 'joi';

//Middleware to validate user registration input
export const validateRegister = (req,res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        console.log("Validation Error:", error.details[0].message);
        return res.status(400).json({message: error.details[0].message});
    }
    next();
}

//Middleware to validate user Login input
export const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    next();
};