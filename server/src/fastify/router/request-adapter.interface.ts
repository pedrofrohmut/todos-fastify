import { FastifyRequest } from "fastify"
import { AdaptedRequest } from "../../domain/types/router.types"

export default interface RequestAdapter {
  adapt(request: FastifyRequest): AdaptedRequest<any>
}
