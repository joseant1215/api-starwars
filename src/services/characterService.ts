// src/services/characterService.ts
import AWS from "aws-sdk";
import { Character } from "../models/Character";

import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';


// const dynamoDB = new AWS.DynamoDB.DocumentClient();
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'StarWarsCharacters';

export const saveToDatabase = async (data: Character): Promise<void> => {
    const params = {
        TableName: TABLE_NAME,
        Item: data,
    };
    // await dynamoDB.put(params).promise();
    await dynamoDb.send(new PutCommand(params));
};

export const getFromDatabase = async (): Promise<Character[]> => {  
    const params = {
        TableName: TABLE_NAME,
    };
    // const result = await dynamoDB.scan(params).promise();
   const result = await dynamoDb.send(new ScanCommand(params));
    return result.Items as Character[];
};
