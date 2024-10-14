import { translateAttributes } from "../utils/translate";
import { saveToDatabase } from "../services/characterService";
import { getCharacterSwapi } from "../services/swapiService";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export const createCharacter: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
        const { id } = JSON.parse(event.body!);
        const data = await getCharacterSwapi(id);
        const translatedData = translateAttributes(data);
        await saveToDatabase(translatedData);
        return {
            statusCode: 201,
            body: JSON.stringify({ 
                message: 'Se registro correctamente', 
                data: translatedData 
            }),
        };
    } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error al crear el personaje',
            error: (error as Error).message,
          }),
        };
    }
}
