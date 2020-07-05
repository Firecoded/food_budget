"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.validateEntry = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const entrySchema = new Schema({
  date: Date,
  breakfast: Number,
  lunch: Number,
  dinner: Number,
  snacks: Number,
  groceries: Number,
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

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
    user: this.user.toJSON()
  };
};

const validateEntry = entry => {
  const schema = {
    date: _joi.default.date(),
    breakfast: _joi.default.number().min(1).max(20).allow(null),
    lunch: _joi.default.number().min(1).max(20).allow(null),
    dinner: _joi.default.number().min(1).max(20).allow(null),
    snacks: _joi.default.number().min(1).max(20).allow(null),
    groceries: _joi.default.number().min(1).max(20).allow(null),
    text: _joi.default.number().min(1).max(20)
  };
  return _joi.default.validate(entry, schema);
};

exports.validateEntry = validateEntry;

const Entry = _mongoose.default.model('Entry', entrySchema);

var _default = Entry;
exports.default = _default;
//# sourceMappingURL=Entry.js.map