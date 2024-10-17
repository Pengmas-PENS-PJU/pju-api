const NO2Conversion = {
  good: {
    ispuMin: 0,
    ispuMax: 50,
    valueMin: 0,
    valueMax: 80,
  },
  moderate: {
    ispuMin: 51,
    ispuMax: 100,
    valueMin: 80,
    valueMax: 200,
  },
  unhealty: {
    ispuMin: 101,
    ispuMax: 200,
    valueMin: 200,
    valueMax: 1130,
  },
  veryUnhealty: {
    ispuMin: 201,
    ispuMax: 300,
    valueMin: 1130,
    valueMax: 2260,
  },
  hazardous: {
    ispuMin: 300,
    ispuMax: 'unlimited',
    valueMin: 2260,
    valueMax: 3000,
  },
};

module.exports = NO2Conversion;
