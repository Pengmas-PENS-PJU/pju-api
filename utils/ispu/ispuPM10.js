const PM10Conversion = {
  good: {
    ispuMin: 0,
    ispuMax: 50,
    valueMin: 0,
    valueMax: 50,
  },
  moderate: {
    ispuMin: 51,
    ispuMax: 100,
    valueMin: 50,
    valueMax: 150,
  },
  unhealty: {
    ispuMin: 101,
    ispuMax: 200,
    valueMin: 150,
    valueMax: 350,
  },
  veryUnhealty: {
    ispuMin: 201,
    ispuMax: 300,
    valueMin: 350,
    valueMax: 420,
  },
  hazardous: {
    ispuMin: 300,
    ispuMax: 'unlimited',
    valueMin: 420,
    valueMax: 500,
  },
};

module.exports = PM10Conversion;