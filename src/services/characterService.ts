// src/services/characterService.ts
import AWS from "aws-sdk";
import { Character } from "../models/Character";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'StarWarsCharacters';

export const saveToDatabase = async (data: Character): Promise<void> => {
    const params = {
        TableName: TABLE_NAME,
        Item: data,
    };
    await dynamoDB.put(params).promise();
};

export const getFromDatabase = async (): Promise<Character[]> => {  
    const params = {
        TableName: TABLE_NAME,
    };
    const result = await dynamoDB.scan(params).promise();
    return result.Items as Character[];
};
