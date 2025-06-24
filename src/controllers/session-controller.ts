import { authConfig } from "@/configs/auth"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"
import { compare } from "bcrypt"
import { Request, Response } from "express"
import { sign, SignOptions } from "jsonwebtoken"
import z from "zod"

const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export class SessionController {
    async create(request: Request, response: Response) {
        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw new AppError("Email ou senha inválidos!", 401)
        }

        const checkPassword = await compare(password, user.password)

        if (!checkPassword) {
            throw new AppError("Email ou senha inválidos!", 401)
        }

        const { expiresIn, secret } = authConfig.jwt

        const token = sign(
            {
                role: user.role,
            },
            secret,
            {
                expiresIn,
                subject: user.id,
            } as SignOptions
        )

        const { password: onlyPassword, ...userWithoutPassword } = user

        response.status(201).json({ user: userWithoutPassword, token })
    }
}
