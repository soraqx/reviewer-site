export function bindNumberRange({ range, number, output, onValue, onInvalid }) {
  const min = Number(number.min);
  const max = Number(number.max);
  const step = Number(number.step);

  function commit(value) {
    number.value = String(value);
    range.value = String(value);
    output.textContent = String(value);
    number.setAttribute('aria-invalid', 'false');
    onInvalid('');
    onValue(value);
  }

  function readNumber() {
    const value = Number(number.value);
    const onStep = Number.isInteger((value - min) / step);
    if (!number.value || !Number.isFinite(value) || value < min || value > max || !onStep) {
      number.setAttribute('aria-invalid', 'true');
      onInvalid(`Enter a value from ${min} to ${max} in steps of ${step}.`);
      return;
    }
    commit(value);
  }

  range.addEventListener('input', () => commit(Number(range.value)));
  number.addEventListener('input', readNumber);
  number.addEventListener('change', readNumber);
  commit(Number(number.value));
}
