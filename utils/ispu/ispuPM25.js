const PM25Conversion = {
  good: {
    ispuMin: 0,
    ispuMax: 50,
    valueMin: 0,
    valueMax: 25.5,
  },
  moderate: {
    ispuMin: 51,
    ispuMax: 100,
    valueMin: 15.5,
    valueMax: 55.4,
  },
  unhealty: {
    ispuMin: 101,
    ispuMax: 200,
    valueMin: 55.4,
    valueMax: 150.4,
  },
  veryUnhealty: {
    ispuMin: 201,
    ispuMax: 300,
    valueMin: 150.4,
    valueMax: 250.4,
  },
  hazardous: {
    ispuMin: 300,
    ispuMax: 'unlimited',
    valueMin: 250.4,
    valueMax: 500,
  },
};

module.exports = PM25Conversion;
