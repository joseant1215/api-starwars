import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { getFromDatabase } from "../services/characterService";

export const getCharacters: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
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
                error: (error as Error).message, // Asegúrate de que el mensaje del error sea una cadena
            }),
        };
    }
};