import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"
import { Request, Response } from "express"
import { z } from "zod"

const bodySchema = z.object({
    delivery_id: z.string().uuid(),
    description: z.string().trim().min(6),
})

const showParamsSchema = z.object({
    delivery_id: z.string().uuid(),
})

export class DeliveryLogsController {
    async create(request: Request, response: Response) {
        const { delivery_id, description } = bodySchema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({ where: { id: delivery_id } })

        if (!delivery) {
            throw new AppError("Encomenda não encontrada", 404)
        }

        if (delivery.status == "delivered") {
            throw new AppError("Esta encomenda já foi entregue")
        }

        if (delivery.status === "processing") {
            throw new AppError("A encomenda ainda está em processamento")
        }

        await prisma.deliveryLog.create({ data: { deliveryId: delivery_id, description } })

        response.status(201).json()
    }

    async show(request: Request, response: Response) {
        const { delivery_id } = showParamsSchema.parse(request.params)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id },
            include: { logs: { select: { description: true } } },
        })

        if (!delivery) {
            throw new AppError("Encomenda não encontrada", 404)
        }

        const user = request.user

        if (user?.role === "customer" && user.id !== delivery.userId) {
            throw new AppError("Você não pode visualizar os logs de outro usuário", 401)
        }

        response.json(delivery.logs)
    }
}
