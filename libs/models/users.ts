import { Schema, Document, Model, model } from 'mongoose';
import { Ue } from './ue';
import { genSalt as bcryptGenSalt, hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';


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
    password?: string;
    email?: string;
    status?:string;
    uc?: number;
    role?: string;
}


const choosen_ue_schema = new Schema<CHOOSEN_UE>({
    ue: { type: String, ref: 'ues_table', autopopulate: { select: ['_id', 'semestre', 'Intitule'], maxDepth: 1 } },
    groupe_cm: { type: Number },
    groupe_td: { type: Number },
    groupe_tp: { type: Number },

});


export interface User extends user, Document {
    _id?: string;
    ues_inscrit?: [Choosen_ue];
}

export const user_schema = new Schema<User>({
    _id: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, index: true, require: true },
    status: { type: String, enum: ['EC', 'PRAG', 'PAST', 'VACATAIRE', 'CDE', 'ATER'] },
    password: { type: String },
    role: { type: String },
    uc: { type: Number },
    ues_inscrit: [choosen_ue_schema]
}).pre<User>('save', function (next) {
    if (!this.isModified('password')) { return next(); }
    bcryptGenSalt(10, (err, salt) => {
        bcryptHash(this.password, salt, (err, hash) => {
            if (err) { return next(err); }
            this.password = hash;
            next();
        });
    });
});

user_schema.plugin(require('mongoose-autopopulate'));
export const user_table: Model<User> = model<User>('user_table', user_schema);


export function comparePassword(candidatePassword, hash, callback) {
    bcryptCompare(candidatePassword, hash, (err, isMatch) => {
        if (err) { throw err };
        callback(null, isMatch);
    });
}