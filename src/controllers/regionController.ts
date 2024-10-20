import {FastifyRequest} from "fastify";
import {updateRegion} from "../services/regionService";

export default class RegionController {
    public static async updateRegion(request: FastifyRequest<{
        Body: Partial<{ cycleDuration: number, name: string }>,
        Params: { id: number }
    }>) {
        const {cycleDuration, name} = request.body;
        const id = request.params.id;

        try {
            const updatedRegion = await updateRegion(id, {cycleDuration, name});
            return {updatedRegion};
        } catch (error) {
            console.error(error);
            return {error: 'Unable to update region.'};
        }
    }
}
