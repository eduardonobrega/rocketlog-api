import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/app-error"
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"

interface TokenPayload {
    role: string
    sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        throw new AppError("JWT token não informado!", 401)
    }

    const [, token] = authHeader.split(" ")

    try {
        const { sub: user_id, role } = verify(token, authConfig.jwt.secret) as TokenPayload

        request.user = {
            id: String(user_id),
            role,
        }
        
        next()
    } catch (error) {
        throw new AppError("JWT token inválido!", 401)
    }
}
