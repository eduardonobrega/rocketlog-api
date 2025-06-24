import { app } from "@/app"
import { prisma } from "@/database/prisma"
import request from "supertest"

describe("UserController", () => {
    let user_id: string

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user_id } })
    })

    it("Deve criar um usuário", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "User test", email: "usertest@email.com", password: "123456" })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")

        user_id = response.body.id
    })

    it("Não deve permitir criar um user com mesmo email", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "New User test", email: "usertest@email.com", password: "123456" })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Este email já está sendo usado.")
    })

    it("Não deve permitir criar um user com o email inválido", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "New User test", email: "invalid-email.com", password: "123456" })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Validation error!")
    })
})
