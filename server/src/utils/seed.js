import faker from 'faker';
import { join } from 'path';

import User from '../models/User';
import Message from '../models/Message';
import { deleteAllAvatars } from './utils';
import Entry from '../models/Entry';

export const seedDb = async () => {
  console.log('Seeding database...');

  await User.deleteMany({});
  await Message.deleteMany({});
  await Entry.deleteMany({});
  await deleteAllAvatars(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

  // create 3 users
  const usersPromises = [...Array(3).keys()].map((index, i) => {
    const user = new User({
      provider: 'email',
      username: `user${index}`,
      email: `email${index}@email.com`,
      password: '123456789',
      name: faker.name.findName(),
      // avatar: faker.image.avatar(),
      avatar: `avatar${index}.jpg`,
      bio: faker.lorem.sentences(3),
    });

    if (index === 0) {
      user.role = 'ADMIN';
    }
    user.registerUser(user, () => {});

    return user;
  });

  await Promise.all(
    usersPromises.map(async (user) => {
      await user.save();
    }),
  );

  // create 9 messages
  const messagePromises = [...Array(9).keys()].map((index, i) => {
    const message = new Message({
      text: faker.lorem.sentences(3),
    });
    return message;
  });
  const entryPromises = [...Array(9).keys()].map((index, i) => {
    const entry = new Entry({
      date: new Date(),
      breakfast: 22.22,
      lunch: 11.22,
      dinner: 11.34,
      snacks: null,
      groceries: 99,
    });
    return entry;
  });

  await Promise.all(
    entryPromises.map(async (entry) => {
      await entry.save();
    }),
  );

  await Promise.all(
    messagePromises.map(async (message) => {
      await message.save();
    }),
  );

  const users = await User.find();
  const messages = await Message.find();
  const entries = await Entry.find();

  // every user 3 messages
  users.map(async (user, index) => {
    const threeMessagesIds = messages.slice(index * 3, index * 3 + 3).map((m) => m.id);
    const threeEntryIds = entries.slice(index * 3, index * 3 + 3).map((m) => m.id);
    await User.updateOne(
      { _id: user.id },
      { $push: { messages: threeMessagesIds } },
      { $push: { entries: threeEntryIds } },
    );
  });

  // 0,1,2 message belong to user 0 ...
  messages.map(async (message, index) => {
    const j = Math.floor(index / 3);
    const user = users[j];
    await Message.updateOne(
      { _id: message.id },
      {
        $set: {
          user: user.id,
        },
      },
    );
  });
  entries.map(async (entry, index) => {
    const j = Math.floor(index / 3);
    const user = users[j];
    await Entry.updateOne(
      { _id: entry.id },
      {
        $set: {
          user: user.id,
        },
      },
    );
  });
};
