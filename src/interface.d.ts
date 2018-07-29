type FirstParam<F> = F extends (o: infer O, ...r: any[]) => any ? O : never
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
