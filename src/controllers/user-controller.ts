import { Request, Response } from "express"
import { z } from "zod"
import { hash } from "bcrypt"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"

const bodySchema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
})

export class UserController {
    async create(request: Request, response: Response) {
        const { name, email, password } = bodySchema.parse(request.body)

        const checkEmail = await prisma.user.findUnique({ where: { email } })

        if (checkEmail) {
            throw new AppError("Este email já está sendo usado.")
        }

        const hashedPassword = await hash(password, 8)

        const { password: onlyPassword, ...userWithoutPassword } = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        response.status(201).json(userWithoutPassword)
    }
}
