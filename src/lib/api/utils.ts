export function delay<T>(value: T, wait = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), wait);
  });
}
