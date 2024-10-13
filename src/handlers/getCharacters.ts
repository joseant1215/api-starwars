import { APIGatewayProxyHandler } from "aws-lambda";
import { getFromDatabase } from "../services/characterService";

export const getCharacters: APIGatewayProxyHandler =  async () => {
    try {
        const data = await getFromDatabase();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Datos recuperados exitosamente',
                data
            }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al recuperar datos',
                error
            }),
        }
    }
};