import axios from "axios";

const SWAPI_BASE_URL = "http://swapi.py4e.com/api/";

export interface SwapiCharacter {
    name: string;
    height: number;
    mass: number;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
}

export const getCharacterSwapi = async (id: number): Promise<SwapiCharacter> => {
    try {
        const response = await axios.get<SwapiCharacter>(`${SWAPI_BASE_URL}people/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching form SWAPI', error);
        throw error;
    }
}