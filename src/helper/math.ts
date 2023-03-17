export function mean(array:number[]): number{
    const sum: number = array.reduce((acc, val) => acc + val, 0);
    const mean: number = sum / array.length;
    return mean
}
export function unique<T>(arr: T[]): T[] {
    return arr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }