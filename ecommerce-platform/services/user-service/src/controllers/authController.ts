import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { registerSchema, loginSchema } from "../schemas/user.schema";
import { generateToken } from "../utils/jwt";
import { BadRequest } from "../Errors/BadRequest";
import { SuccessResponse } from "../utils/response";

export const register = async (req: Request, res: Response) => {
        const { name, email, password } = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new BadRequest("Email already exists");
        }

        const hashedPassword = await hashPassword(password);
        const role = "CUSTOMER";
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        const token = generateToken(newUser.id, newUser.role);
        return SuccessResponse(res, {
            message: "User registered successfully",
            data: newUser,
            token,
        });
};

export const login = async (req: Request, res: Response) => {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new BadRequest("Invalid email or password");
        }
        
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequest("Incorrect credentials");
        }

        const token = generateToken(user.id, user.role);

        return SuccessResponse(res, {
            message: "User logged in successfully",
            data: user,
            token,
        });
};
