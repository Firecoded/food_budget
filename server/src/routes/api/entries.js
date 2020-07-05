import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Entry, { validateEntry } from '../../models/Entry';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: 'desc' }).populate('user');

    res.json({
      entries: entries.map((ent) => {
        return ent.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('user');
    if (!entry) return res.status(404).json({ message: 'No entry found.' });
    res.json({ entry: entry.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateEntry(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let entry = await Message.create({
      date: req.body.date,
      breakfast: req.body.breakfast,
      lunch: req.body.lunch,
      dinner: req.body.dinner,
      snacks: req.body.snacks,
      groceries: req.body.groceries,
      user: req.user.id,
    });
    entry = await entry.populate('user').execPopulate();

    res.status(200).json({ entry: entry.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempEntry = await Entry.findById(req.params.id).populate('user');
    if (!(tempEntry.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not the message owner or admin.' });

    const entry = await Entry.findByIdAndRemove(req.params.id).populate('user');
    if (!entry) return res.status(404).json({ message: 'No entry found.' });
    res.status(200).json({ entry });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  const { error } = validateEntry(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const tempEntry = await Entry.findById(req.params.id).populate('user');
    if (!(tempEntry.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'Not the entry owner or admin.' });

    let entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        date: req.body.date,
        breakfast: req.body.breakfast,
        lunch: req.body.lunch,
        dinner: req.body.dinner,
        snacks: req.body.snacks,
        groceries: req.body.groceries,
        user: req.user.id,
      },
      { new: true },
    );
    if (!entry) return res.status(404).json({ message: 'No entry found.' });
    entry = await entry.populate('user').execPopulate();

    res.status(200).json({ entry });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
