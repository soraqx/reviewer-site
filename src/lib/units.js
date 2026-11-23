const unitDefinitions = [
  {
    dimension: 'length',
    canonicalUnit: 'cm',
    units: {
      mm: 0.1,
      millimeter: 0.1,
      millimeters: 0.1,
      cm: 1,
      centimeter: 1,
      centimeters: 1,
      m: 100,
      meter: 100,
      meters: 100,
      km: 100_000,
      kilometer: 100_000,
      kilometers: 100_000,
    },
  },
  {
    dimension: 'area',
    canonicalUnit: 'cm²',
    units: {
      mm2: 0.01,
      cm2: 1,
      m2: 10_000,
    },
  },
  {
    dimension: 'angle',
    canonicalUnit: 'deg',
    units: {
      deg: 1,
      '°': 1,
      degree: 1,
      degrees: 1,
      rad: 180 / Math.PI,
      radian: 180 / Math.PI,
      radians: 180 / Math.PI,
    },
  },
  {
    dimension: 'time',
    canonicalUnit: 's',
    units: {
      s: 1,
      sec: 1,
      second: 1,
      seconds: 1,
      ms: 0.001,
      min: 60,
      minute: 60,
      minutes: 60,
      h: 3600,
      hour: 3600,
      hours: 3600,
    },
  },
  {
    dimension: 'mass',
    canonicalUnit: 'kg',
    units: {
      g: 0.001,
      gram: 0.001,
      grams: 0.001,
      kg: 1,
      kilogram: 1,
      kilograms: 1,
    },
  },
];

const unitLookup = new Map(
  unitDefinitions.flatMap(({ dimension, canonicalUnit, units }) =>
    Object.entries(units).map(([name, factor]) => [
      normalizeUnit(name),
      { dimension, canonicalUnit, factor },
    ]),
  ),
);

function normalizeUnit(unit) {
  if (typeof unit !== 'string') return '';
  return unit.trim().toLocaleLowerCase().replace(/²/g, '2').replace(/\s+/g, '');
}

export function resolveUnit(unit) {
  return unitLookup.get(normalizeUnit(unit)) ?? null;
}

export function validateUnit(unit, expectedDimension) {
  const definition = resolveUnit(unit);
  if (!definition) {
    return { valid: false, message: 'Enter a recognized unit.' };
  }
  if (definition.dimension !== expectedDimension) {
    return {
      valid: false,
      message: `That is a ${definition.dimension} unit; this answer needs ${expectedDimension}.`,
    };
  }
  return { valid: true, definition };
}

export function convertUnits(value, fromUnit, toUnit) {
  if (!Number.isFinite(value)) {
    return { valid: false, message: 'Enter a finite numeric value.' };
  }
  const from = resolveUnit(fromUnit);
  const to = resolveUnit(toUnit);
  if (!from || !to) {
    return { valid: false, message: 'Enter recognized units.' };
  }
  if (from.dimension !== to.dimension) {
    return { valid: false, message: 'Those units measure different quantities.' };
  }
  return {
    valid: true,
    value: (value * from.factor) / to.factor,
    dimension: from.dimension,
  };
}
