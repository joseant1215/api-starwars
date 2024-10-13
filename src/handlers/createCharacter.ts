import { APIGatewayProxyHandler } from "aws-lambda";
import { translateAttributes } from "../utils/translate";
import { saveToDatabase } from "../services/characterService";

export const createCharacter: APIGatewayProxyHandler = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const translatedData = translateAttributes(body);
        await saveToDatabase(translatedData);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Se registro correctamente', data: translatedData }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al registrar el elemento', error }),
        }
    }
}
