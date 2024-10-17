const SO2Conversion = {
  good: {
    ispuMin: 0,
    ispuMax: 50,
    valueMin: 0,
    valueMax: 52,
  },
  moderate: {
    ispuMin: 51,
    ispuMax: 100,
    valueMin: 52,
    valueMax: 180,
  },
  unhealty: {
    ispuMin: 101,
    ispuMax: 200,
    valueMin: 180,
    valueMax: 400,
  },
  veryUnhealty: {
    ispuMin: 201,
    ispuMax: 300,
    valueMin: 400,
    valueMax: 800,
  },
  hazardous: {
    ispuMin: 300,
    ispuMax: 'unlimited',
    valueMin: 800,
    valueMax: 1200,
  },
};

module.exports = SO2Conversion;