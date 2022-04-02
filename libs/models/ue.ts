import { Schema, Document, Model, model } from 'mongoose';



interface ue {
    "Formation"?: string;
    "Semestre"?: string;
    "Ref"?: string;
    "Intitulé"?: string;
    "Statut"?: string;
    "h/CM"?: number;
    "h/TD"?: number;
    "h/TP"?: number;
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
    "Intitulé" : {type: String},
    "Statut" : {type: String},
    "h/CM" : {type: Number},
    "h/TD" : {type: Number},
    "h/TP" : {type: Number},
    "Effectif" : {type: Number},
    "grCM" : {type: Number},
    "grTD" : {type: Number},
    "grTP" : {type: Number},
});

export const ues_table: Model<Ue> = model<Ue>('ues_table', ues_schema)