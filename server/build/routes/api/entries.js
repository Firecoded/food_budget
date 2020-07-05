"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _requireJwtAuth = _interopRequireDefault(require("../../middleware/requireJwtAuth"));

var _Entry = _interopRequireWildcard(require("../../models/Entry"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.get('/', async (req, res) => {
  try {
    const entries = await _Entry.default.find().sort({
      createdAt: 'desc'
    }).populate('user');
    res.json({
      entries: entries.map(ent => {
        return ent.toJSON();
      })
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const entry = await _Entry.default.findById(req.params.id).populate('user');
    if (!entry) return res.status(404).json({
      message: 'No entry found.'
    });
    res.json({
      entry: entry.toJSON()
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
router.post('/', _requireJwtAuth.default, async (req, res) => {
  const {
    error
  } = (0, _Entry.validateEntry)(req.body);
  if (error) return res.status(400).json({
    message: error.details[0].message
  });

  try {
    let entry = await Message.create({
      date: req.body.date,
      breakfast: req.body.breakfast,
      lunch: req.body.lunch,
      dinner: req.body.dinner,
      snacks: req.body.snacks,
      groceries: req.body.groceries,
      user: req.user.id
    });
    entry = await entry.populate('user').execPopulate();
    res.status(200).json({
      entry: entry.toJSON()
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
router.delete('/:id', _requireJwtAuth.default, async (req, res) => {
  try {
    const tempEntry = await _Entry.default.findById(req.params.id).populate('user');
    if (!(tempEntry.user.id === req.user.id || req.user.role === 'ADMIN')) return res.status(400).json({
      message: 'Not the message owner or admin.'
    });
    const entry = await _Entry.default.findByIdAndRemove(req.params.id).populate('user');
    if (!entry) return res.status(404).json({
      message: 'No entry found.'
    });
    res.status(200).json({
      entry
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
router.put('/:id', _requireJwtAuth.default, async (req, res) => {
  const {
    error
  } = (0, _Entry.validateEntry)(req.body);
  if (error) return res.status(400).json({
    message: error.details[0].message
  });

  try {
    const tempEntry = await _Entry.default.findById(req.params.id).populate('user');
    if (!(tempEntry.user.id === req.user.id || req.user.role === 'ADMIN')) return res.status(400).json({
      message: 'Not the entry owner or admin.'
    });
    let entry = await _Entry.default.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      breakfast: req.body.breakfast,
      lunch: req.body.lunch,
      dinner: req.body.dinner,
      snacks: req.body.snacks,
      groceries: req.body.groceries,
      user: req.user.id
    }, {
      new: true
    });
    if (!entry) return res.status(404).json({
      message: 'No entry found.'
    });
    entry = await entry.populate('user').execPopulate();
    res.status(200).json({
      entry
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=entries.js.map