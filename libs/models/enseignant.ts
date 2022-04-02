import { Schema, Document, Model, model } from 'mongoose';


interface enseignant {
    name?: string;
}

export interface Enseignant extends enseignant, Document {
    _id?: string;
}

export const enseignant_schema = new Schema<Enseignant>({
    name: { type: String }
})

export const enseignants_table: Model<Enseignant> = model<Enseignant>('enseignants_table', enseignant_schema)