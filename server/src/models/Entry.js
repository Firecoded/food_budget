import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const entrySchema = new Schema(
  {
    date: Date,
    breakfast: Number,
    lunch: Number,
    dinner: Number,
    snacks: Number,
    groceries: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

entrySchema.methods.toJSON = function () {
  return {
    id: this._id,
    date: this.date,
    breakfast: this.breakfast,
    lunch: this.lunch,
    dinner: this.dinner,
    snacks: this.snacks,
    groceries: this.groceries,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    user: this.user.toJSON(),
  };
};

export const validateEntry = (entry) => {
  const schema = {
    date: Joi.date(),
    breakfast: Joi.number().min(1).max(20).allow(null),
    lunch: Joi.number().min(1).max(20).allow(null),
    dinner: Joi.number().min(1).max(20).allow(null),
    snacks: Joi.number().min(1).max(20).allow(null),
    groceries: Joi.number().min(1).max(20).allow(null),
    text: Joi.number().min(1).max(20),
  };
  return Joi.validate(entry, schema);
};

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
