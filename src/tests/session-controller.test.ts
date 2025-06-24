import { app } from "@/app"
import { prisma } from "@/database/prisma"
import request from "supertest"

describe("SessionController", () => {
    let user_id: string

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user_id } })
    })
    it("deve autenticar e retornar um token", async () => {
        const userResponse = await request(app)
            .post("/users")
            .send({ name: "Auth User test", email: "auth.test@email.com", password: "123456" })

        user_id = userResponse.body.id

        const sessionResponse = await request(app)
            .post("/sessions")
            .send({ email: "auth.test@email.com", password: "123456" })

        expect(sessionResponse.status).toBe(201)
        expect(sessionResponse.body.token).toEqual(expect.any(String))
    })
})
