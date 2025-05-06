import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// PARAMS ID SCHEMA

const paramsIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"ParameterId" must be a valid MongoDB ObjectId`,
    }),
});

export const validateParamsID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = paramsIdSchema.validate(req.params);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

// LOGIN SCHEMA

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "org", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*])[A-Za-z\d@$*?&]{8,12}$/)
    .messages({
      "string.pattern.base":
        "Password should contain 8-12 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, *)",
    }),
});

export const validateLoginBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

// USER-SCHEMA

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "org", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*])[A-Za-z\d@$*?&]{8,12}$/)
    .messages({
      "string.pattern.base":
        "Password should contain 8-12 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, *)",
    })
    .required(),
  role: Joi.string().valid("ADMIN", "USER", "AGENT").default("USER"),
  city: Joi.string().optional(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .optional(),
  image: Joi.string().optional(),
  isActive: Joi.boolean().default(false),
});
// USER-BODY VALIDATE MIDDLEWARE
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
  bedrooms: Joi.number().required(),
  parking: Joi.number().required(),
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
// PROPERTY-BODY VALIDATE MIDDLEWARE
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

// ADDRESS-BODY SCHEMA

const addressSchema = Joi.object({
  city: Joi.string().required(),
  district: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
});
// PROPERTY-BODY VALIDATE MIDDLEWARE
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

// INQUIRY-SCHEMA

const inquirySchema = Joi.object({
  propertyId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"propertyId" must be a valid MongoDB ObjectId`,
    }),
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"userId" must be a valid MongoDB ObjectId`,
    }),
  message: Joi.string().required(),
  status: Joi.string().valid("PENDING", "RESPONDED").default("PENDING"),
});
// INQUIRY-BODY VALIDATE MIDDLEWARE
export const validateInquiryBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = inquirySchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

// BOOKING-SCHEMA

const bookingSchema = Joi.object({
  propertyId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"propertyId" must be a valid MongoDB ObjectId`,
    }),
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `"userId" must be a valid MongoDB ObjectId`,
    }),
  bookingDate: Joi.date().default(new Date()),
  status: Joi.string().valid("CONFIRMED", "CANCELLED").default("CONFIRMED"),
  paymentStatus: Joi.string()
    .valid("PENDING", "PAID", "FAILED")
    .default("PENDING"),
});
// INQUIRY-BODY VALIDATE MIDDLEWARE
export const validateBookingBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};
