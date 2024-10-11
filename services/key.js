const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();
const apiSecretKey = process.env.API_SECRET_KEY;

const encrypt = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(apiSecretKey, 'hex'), Buffer.alloc(16, 0));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(apiSecretKey, 'hex'), Buffer.alloc(16, 0));

  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.generateKey = async () => {
  const existingKey = await prisma.apiKey.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!existingKey) {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const encryptedKey = encrypt(apiKey);
    const newKey = await prisma.apiKey.create({
      data: { key: encryptedKey },
    });

    console.log(`Generated and stored API key: ${apiKey}`);
    return apiKey;
  } else {
    const decryptedKey = decrypt(existingKey.key);

    console.log(`Using existing API key: ${decryptedKey}`);
    return decryptedKey;
  }
};

exports.getKey = async () => {
  try {
    const existingKey = await prisma.apiKey.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existingKey) {
      return existingKey.key;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error;
  }
};

exports.decrypt = decrypt;
