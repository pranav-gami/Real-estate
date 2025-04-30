import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// USER-SCHEMA

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "org", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*])[A-Za-z\d@$*?&]{8,12}$/)
    .messages({
      "string.pattern.base":
        "Password should contain 8-12 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, *)",
    }),
  role: Joi.string().valid("ADMIN", "USER", "AGENT").default("USER"),
  city: Joi.string(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  image: Joi.string().optional(),
  isActive: Joi.boolean().default(false),
});

// USERBODY VALIDATE MIDDLEWARE
export const validateUserBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

// PROPERTY SCHEMA

const propertySchema = Joi.object({
  title: Joi.string().min(10).max(100).required(),
  decription: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  size: Joi.string().required(),
  bedrroms: Joi.string().optional(),
  parking: Joi.string().optional(),
  propertyType: Joi.string()
    .valid("Apartment", "House", "Villa", "Plot")
    .default("House"),
  status: Joi.string().valid("Sale", "Rent", "Sold", "Rented").default("Sale"),
  images: Joi.array().items(Joi.string()).min(2).max(5).required(),
  ownerId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"ownerId" must be a valid MongoDB ObjectId`,
    }),
  addressId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"addressId" must be a valid MongoDB ObjectId`,
    }),
});

// PROPERTYBODY VALIDATE MIDDLEWARE
export const validatePropertyBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = propertySchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

// ADDRESS BODY SCHEMA

const addressSchema = Joi.object({
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
});

// PROPERTYBODY VALIDATE MIDDLEWARE
export const validateAddressBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = addressSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};
