import { Schema, Document, Model, model } from 'mongoose';
import { Ue } from './ue';


interface choosen_ue {
    groupe_cm?: number;
    groupe_td?: number;
    groupe_tp?: number;
}

export interface Choosen_ue extends choosen_ue {
    ue?: Ue;
}

interface CHOOSEN_UE extends choosen_ue, Document { } 

interface user {
    first_name?: string;
    last_name?: string;
    user_name?: string;
    password?: string;
    mail?: string;
    name?: string;
}


const choosen_ue_schema = new Schema<CHOOSEN_UE>({
    ue: {type: String, ref: 'ues_table', autopopulate: { select: ['_id', 'semestre', 'Intitulé'], maxDepth: 1} },
    groupe_cm: {type: Number},
    groupe_td: {type: Number},
    groupe_tp: {type: Number},

});


export interface User extends user, Document {
    _id?: string;
    ues_inscrit?: [Choosen_ue];
}

export const user_schema = new Schema<User>({
    _id: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    user_name: { type: String },
    password: { type: String },
    mail: { type: String },
    name: { type: String },
    ues_inscrit: [choosen_ue_schema]
});

user_schema.plugin(require('mongoose-autopopulate'));
export const user_table: Model<User> = model<User>('user_table', user_schema)