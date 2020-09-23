interface StrategyMemoryInterface {
  previous: number;
  actual: number;
}
interface VariationInterface {
  actual: number;
  takeProfit: number;
  stopLoss: number;
}

export const shouldBuy = (p: {
  rsi: {
    strategy: number;
    previous: number;
    actual: number;
  };
  ma: {
    first: StrategyMemoryInterface;
    second: StrategyMemoryInterface;
  };
}): boolean => {
  let res = false;
  let rsiSignal = false;
  let maSignal = false;
  if (p.rsi.previous < p.rsi.strategy && p.rsi.actual >= p.rsi.strategy) {
    rsiSignal = true;
  }
  if (
    p.ma.first.previous >= p.ma.second.previous &&
    p.ma.first.actual < p.ma.second.actual
  ) {
    maSignal = true;
  }
  if (maSignal || rsiSignal) {
    res = true;
  }
  return res;
};

export const shouldSell = (p: {
  variation: VariationInterface;
  rsi: {
    strategy: number;
    previous: number;
    actual: number;
  };
  ma: {
    first: StrategyMemoryInterface;
    second: StrategyMemoryInterface;
  };
}): boolean => {
  let res = false;
  let variationSignal = false;
  let rsiSignal = false;
  let maSignal = false;
  if (
    p.variation.actual >= p.variation.takeProfit ||
    p.variation.actual <= p.variation.stopLoss
  ) {
    variationSignal = true;
  }
  if (p.rsi.previous > p.rsi.strategy && p.rsi.actual <= p.rsi.strategy) {
    rsiSignal = true;
  }
  if (
    p.ma.first.previous <= p.ma.second.previous &&
    p.ma.first.actual > p.ma.second.actual
  ) {
    maSignal = true;
  }
  if (variationSignal && (rsiSignal || maSignal)) {
    res = true;
  }
  return res;
};
