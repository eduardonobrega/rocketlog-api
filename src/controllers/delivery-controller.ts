import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"
import { Request, Response } from "express"
import { z } from "zod"

const bodySchema = z.object({
    user_id: z.string().uuid(),
    description: z.string().trim().min(6),
})

const updateParamsSchema = z.object({
    id: z.string().uuid(),
})

const updateBodySchema = z.object({
    status: z.enum(["processing", "shipped", "delivered"]),
})

export class DeliveryController {
    async create(request: Request, response: Response) {
        const { user_id, description } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({ where: { id: user_id } })

        if (!user) {
            throw new AppError("Usuário não encontrado")
        }

        await prisma.delivery.create({ data: { description, userId: user_id } })

        response.status(201).json()
    }

    async index(request: Request, response: Response) {
        const deliveries = await prisma.delivery.findMany({
            include: {
                user: { select: { name: true, email: true } },
                logs: { select: { description: true }, orderBy: { createdAt: "desc" } },
            },
        })

        response.json(deliveries)
    }

    async update(request: Request, response: Response) {
        const { id } = updateParamsSchema.parse(request.params)
        const { status } = updateBodySchema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({ where: { id } })

        if (!delivery) {
            throw new AppError("Encomenda não encontrada", 404)
        }

        if (delivery.status === status) {
            throw new AppError("A Encomenda já possui este status")
        }

        await prisma.delivery.update({ where: { id }, data: { status } })
        await prisma.deliveryLog.create({ data: { deliveryId: delivery.id, description: status } })

        response.json()
    }
}
