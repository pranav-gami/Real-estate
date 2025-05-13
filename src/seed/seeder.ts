import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/user.model";
import Address from "../models/propertyAddress.model";
import Property from "../models/property.model";
import Inquiry from "../models/inquiry.model";

const MONGO_URL = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await Promise.all([
      Inquiry.deleteMany({}),
      Property.deleteMany({}),
      Address.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("Cleared all existing data from Database");

    const hashedPassword = async (pass: string) => {
      return await bcrypt.hash(pass, 5);
    };

    // SEED USERS
    const users = await User.insertMany([
      {
        name: "Admin",
        email: "admin123@gmail.com",
        password: await hashedPassword("Admin@123"),
        phone: "9824500000",
        city: "Ahemedabad",
        role: "ADMIN",
        isActive: false,
        image: "1745995121316-300-1.jpg",
      },
      {
        name: "Pranav Gami",
        email: "pranav123@gmail.com",
        password: await hashedPassword("Pranav@123"),
        phone: "9824500001",
        city: "Ahemedabad",
        role: "AGENT",
        isActive: true,
        image: "1745995121316-300-1.jpg",
      },
      {
        name: "Hiten Sidapara",
        email: "hiten123@gmail.com",
        password: await hashedPassword("Hiten@123"),
        phone: "9824500002",
        city: "Junagadh",
        role: "AGENT",
        isActive: false,
        image: "1745906196925-300-21.jpg",
      },
      {
        name: "Darshit Bervaliya",
        email: "darshit123@gmail.com",
        password: await hashedPassword("Darshit@123"),
        phone: "9824500003",
        city: "Rajkot",
        role: "USER",
        isActive: false,
        image: "1745906196925-300-21.jpg",
      },
      {
        name: "Sagar Ratanpara",
        email: "sagar123@gmail.com",
        password: await hashedPassword("Sagar@123"),
        phone: "9824500004",
        city: "Ahemedabad",
        role: "USER",
        isActive: false,
        image: "1745906196925-300-21.jpg",
      },
    ]);

    // -------- SEED ADDRESSES --------
    const addresses = await Address.insertMany([
      {
        city: "Sanand",
        district: "Ahemedabad",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Bawla",
        district: "Ahemedabad",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Satellite",
        district: "Ahemedabad",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Bopal",
        district: "Ahemedabad",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Maninagar",
        district: "Ahemedabad",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Naroda",
        district: "Ahemedabad",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Mavdi",
        district: "Rajkot",
        state: "Gujrat",
        country: "India",
      },
      {
        city: "Andheri-East",
        district: "Mumbai",
        state: "Maharastra",
        country: "India",
      },
    ]);

    // -------- SEED PROPERTIES --------
    const properties = await Property.insertMany([
      {
        title: "Skyline Towers: 3 BHK Flats Apparments",
        description:
          "3 BHK Flat in Satellite,Fully Furnished & Better Accomodation",
        price: 1800000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "300",
        bedrooms: 3,
        parking: 2,
        propertyType: "Apartment",
        status: "Sale",
        images: ["housecommon.jpg", "property1.1.jpeg"],
        ownerId: users[1]._id,
        addressId: addresses[0]._id,
      },
      {
        title: "4 BHK Flat in Ahemdabad",
        description: "4 BHK Flats in Bopal, Well Furnished with Better Quality",
        price: 25000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "340",
        bedrooms: 4,
        parking: 2,
        propertyType: "Apartment",
        status: "Rent",
        images: ["housecommon1.jpeg", "property1.2.jpeg"],
        ownerId: users[2]._id,
        addressId: addresses[3]._id,
      },
      {
        title: "Seavy Strata: 2 BHK Flats",
        description: "2 BHK Flats,Un furnished,Isckon Elegance Appartments",
        price: 19000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "340",
        bedrooms: 2,
        parking: 1,
        propertyType: "House",
        status: "Rent",
        images: ["property1.2.jpeg", "housecommon1.jpeg"],
        ownerId: users[2]._id,
        addressId: addresses[4]._id,
      },
      {
        title: "Leela Basemnt House",
        description:
          "Fully furnished and well Structured basement House in Ahemdabad",
        price: 4000000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "800",
        bedrooms: 3,
        parking: 2,
        propertyType: "House",
        status: "Sale",
        images: ["property2.1.jpeg", "housecommon1.jpeg"],
        ownerId: users[1]._id,
        addressId: addresses[5]._id,
      },
      {
        title: "Avasar Villa",
        description:
          "Spacious luxury villa featuring a private swimming pool, modern basement lounge, landscaped garden, and elegant interiors — perfect for upscale living and entertaining in style.",
        price: 10000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "1500",
        bedrooms: 5,
        parking: 3,
        propertyType: "Villa",
        status: "Rent",
        images: ["villa2.1.jpg", "villa2.3.jpg"],
        ownerId: users[2]._id,
        addressId: addresses[0]._id,
      },
      {
        title: "Radhe Krishna Villa for Sale",
        description:
          "featuring a private swimming pool, landscaped garden, and elegant interiors — perfect for Liviing entertaining in style.",
        price: 25000000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "1500",
        bedrooms: 5,
        parking: 4,
        propertyType: "Villa",
        status: "Sale",
        images: ["villa1.1.jpg", "villa1.2.jpg", "villa1.3.jpg"],
        ownerId: users[2]._id,
        addressId: addresses[2]._id,
      },
      {
        title: "Raggazoo Villa for Rent",
        description:
          "This villa featuring a private swimming pool, and elegant interiors — perfect for upscale and entertaining in style.",
        price: 8000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "1200",
        bedrooms: 3,
        parking: 2,
        propertyType: "Villa",
        status: "Rent",
        images: ["villa3.1.jpg", "villa3.2.jpg"],
        ownerId: users[1]._id,
        addressId: addresses[3]._id,
      },
      {
        title: "Nandanvan Farm",
        description:
          "Spacious luxury villa featuring a private swimming pool, modern basement lounge, and elegant interiors — perfect for upscale living.",
        price: 19000000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "100",
        bedrooms: 4,
        parking: 2,
        propertyType: "Villa",
        status: "Sale",
        images: ["villa4.1.jpg", "villa4.2.jpg"],
        ownerId: users[1]._id,
        addressId: addresses[7]._id,
      },
      {
        title: "Plot Area in Bawla",
        description:
          "Industrail plot available for sale in Bawla. Located in a Industrail area with great connectivity.",
        price: 2200000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "2400",
        propertyType: "Plot",
        status: "Sale",
        images: ["plot1.1.jpg", "plot1.2.jpeg"],
        ownerId: users[2]._id,
        addressId: addresses[1]._id,
      },
      {
        title: "Residential Plot area in Sanand",
        description:
          "Residential plot available for sale, ideal for building your dream home.surrounded by peaceful surroundings.",
        price: 2900000,
        location:
          "https://www.google.co.in/maps/place/Furrisic+Infotech/@23.009359,72.5229264,17z/data=!4m14!1m7!3m6!1s0x395e853d43a0a7f5:0x66067c41833aadbf!2sFurrisic+Infotech!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm!3m5!1s0x395e853d43a0a7f5:0x66067c41833aadbf!8m2!3d23.009359!4d72.5229264!16s%2Fg%2F11v5d5rbgm?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D",
        size: "1670",
        propertyType: "Plot",
        status: "Sale",
        images: ["plot2.1.jpeg", "plot2.2.jpeg"],
        ownerId: users[1]._id,
        addressId: addresses[2]._id,
      },
    ]);

    // -------- SEED INQUIRIES --------
    const inquiries = await Inquiry.insertMany([
      {
        propertyId: properties[0]._id,
        userId: users[3]._id,
        message: "Is this apartment still available?",
        status: "PENDING",
      },
      {
        propertyId: properties[1]._id,
        userId: users[3]._id,
        message: "Is the Rent negotiable for this Flat?",
        status: "PENDING",
      },
      {
        propertyId: properties[2]._id,
        userId: users[3]._id,
        message: "Is the Rent negotiable for this?",
        status: "PENDING",
      },
      {
        propertyId: properties[6]._id,
        userId: users[3]._id,
        message: "Is this Available this Sunday?",
        status: "PENDING",
      },
    ]);
    console.log(`Seeded ${inquiries.length} inquiries`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();
