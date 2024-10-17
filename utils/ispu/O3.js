const O3Conversion = {
  good: {
    ispuMin: 0,
    ispuMax: 50,
    valueMin: 0,
    valueMax: 120,
  },
  moderate: {
    ispuMin: 51,
    ispuMax: 100,
    valueMin: 120,
    valueMax: 235,
  },
  unhealty: {
    ispuMin: 101,
    ispuMax: 200,
    valueMin: 235,
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
    valueMax: 1000,
  },
};

module.exports = O3Conversion;