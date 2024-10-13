import { Character } from "../models/Character";
import { SwapiCharacter } from "../services/swapiService";
import { v4 as uuidv4 } from 'uuid';

export const translateAttributes = (data: SwapiCharacter): Character => {
    return {
        id: uuidv4(), // Genera un UUID aquí
        nombre: data.name,
        altura: `${data.height} cm`,
        masa: `${data.mass} kg`,
        color_pelo: data.hair_color,
        color_piel: data.skin_color,
        color_ojos: data.eye_color,
        nacimiento: data.birth_year,
        genero: data.gender === "M" || data.gender === "male"? "masculino" : "femenino"
    };
};