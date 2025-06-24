import { Router } from "express"
import { userRoutes } from "./user-routes"
import { sessionRoutes } from "./session-routes"
import { deliveryRoutes } from "./delivery-routes"
import { deliveryLogsRoutes } from "./delivery-logs-routes"

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/sessions", sessionRoutes)
routes.use("/deliveries", deliveryRoutes)
routes.use("/delivery-logs", deliveryLogsRoutes)

export { routes }
