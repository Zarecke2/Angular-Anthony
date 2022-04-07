import { Schema, Document, Model, model } from 'mongoose';



interface ue {
    "Formation"?: string;
    "Semestre"?: string;
    "Ref"?: string;
    "Intitule"?: string;
    "Statut"?: string;
    "h_CM"?: number;
    "h_TD"?: number;
    "h_TP"?: number;
    "Effectif"?: number;
    "grCM"?: number;
    "grTD"?: number;
    "grTP"?: number;
}

export interface Ue extends ue, Document {
    _id?: string;
}

export const ues_schema = new Schema<Ue>({
    "_id": { type: String },
    "Formation" : {type: String},
    "Semestre" : {type: String},
    "Ref" : {type: String},
    "Intitule" : {type: String},
    "Statut" : {type: String},
    "h_CM" : {type: Number},
    "h_TD" : {type: Number},
    "h_TP" : {type: Number},
    "Effectif" : {type: Number},
    "grCM" : {type: Number},
    "grTD" : {type: Number},
    "grTP" : {type: Number},
});

export const ues_table: Model<Ue> = model<Ue>('ues_table', ues_schema)