// Definición del esquema y modelo de Mongoose para la entidad User.
// Define la estructura de los documentos de usuario en la base de datos.

import mongoose from 'mongoose';
import { User } from '../interfaces/user.interface';

export interface UserModel extends Omit<User, 'id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Agrega automáticamente los campos createdAt y updatedAt
  }
);

export const UserModel = mongoose.model<UserModel>('User', userSchema);
