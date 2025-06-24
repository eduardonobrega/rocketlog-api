import { Router } from "express"
import { DeliveryController } from "../controllers/delivery-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const deliveryRoutes = Router()
const deliveryController = new DeliveryController()

deliveryRoutes.use(ensureAuthenticated)
deliveryRoutes.post("/", verifyUserAuthorization(["sale"]), deliveryController.create)
deliveryRoutes.patch("/:id/status", verifyUserAuthorization(["sale"]), deliveryController.update)
deliveryRoutes.get("/", deliveryController.index)

export { deliveryRoutes }
