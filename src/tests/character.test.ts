import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getCharacters } from "../handlers/getCharacters";
import { createCharacter } from "../handlers/createCharacter";
import * as characterService from "../services/characterService";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as swapiService from "../services/swapiService";
import * as translateUtils from "../utils/translate";

jest.mock("../services/characterService");
jest.mock("../services/swapiService");
jest.mock("../utils/translate");

describe("getCharacters handler", () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeEach(() => {
    mockEvent = {} as any;
    mockContext = {} as any;
  });

  it("debe devolver un código de estado 200 y los datos de la base de datos", async () => {
    const mockData = [{ id: 1, name: "Luke Skywalker" }];
    (characterService.getFromDatabase as jest.Mock).mockResolvedValue(mockData);

    const result = (await getCharacters(
      mockEvent,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      message: "Datos recuperados exitosamente",
      data: mockData,
    });
  });

  it("debería devolver un código de estado 500 en caso de error", async () => {
    const mockError = new Error("Database error");
    (characterService.getFromDatabase as jest.Mock).mockRejectedValue(
      mockError
    );

    const result = (await getCharacters(
      mockEvent,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: "Error al recuperar datos",
      error: "Database error",
    });
  });
});

describe("createCharacter handler", () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeEach(() => {
    mockEvent = {} as any;
    mockContext = {} as any;
    (DynamoDBDocumentClient as any).prototype.send = jest.fn();
  });

  it("debería crear un personaje y almacenarlo en DynamoDB", async () => {
    const mockSwapiResponse = {
      name: "R2-D2",
      height: "96",
      mass: "32",
      hair_color: "n/a",
      skin_color: "white, blue",
      eye_color: "red",
      birth_year: "33BBY",
      gender: "n/a",
      homeworld: "https://swapi.py4e.com/api/planets/8/",
    };

    const translatedData = {
      id: "mock-id",
      nombre: "R2-D2",
      altura: "96",
      masa: "32",
      color_pelo: "n/a",
      color_piel: "white, blue",
      color_ojos: "red",
      año_nacimiento: "33BBY",
      género: "n/a",
      planeta_natal: "https://swapi.py4e.com/api/planets/8/",
    };

    (swapiService.getCharacterSwapi as jest.Mock).mockResolvedValue(
      mockSwapiResponse
    );
    (translateUtils.translateAttributes as jest.Mock).mockReturnValue(
      translatedData
    );
    (characterService.saveToDatabase as jest.Mock).mockResolvedValue({});

    mockEvent.body = JSON.stringify({ id: 3 });

    const result = (await createCharacter(
      mockEvent,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toMatchObject({
      message: "Se registro correctamente",
      data: translatedData,
    });
    expect(swapiService.getCharacterSwapi).toHaveBeenCalledWith(3);
    expect(translateUtils.translateAttributes).toHaveBeenCalledWith(
      mockSwapiResponse
    );
    expect(characterService.saveToDatabase).toHaveBeenCalledWith(
      translatedData
    );
  });

  it("debería devolver un código de estado 500 en caso de error", async () => {
    const mockError = new Error("SWAPI error");
    (swapiService.getCharacterSwapi as jest.Mock).mockRejectedValue(mockError);

    mockEvent.body = JSON.stringify({ id: 1 });

    const result = (await createCharacter(
      mockEvent,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: "Error al crear el personaje",
      error: "SWAPI error",
    });
  });
});
