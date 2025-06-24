import { AppError } from "@/utils/app-error"
import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"

export function errorHandling(error: any, request: Request, response: Response, _: NextFunction) {
    if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message })
        return
    }

    if (error instanceof ZodError) {
        response.status(400).json({
            message: "Validation error!",
            issues: error.format(),
        })
        return
    }

    response.status(500).json({ message: error.message || "Internal server error" })
}
