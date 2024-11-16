// From https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
// Not perfect, but good enough for this
export type IfEquals<T, U, Y=unknown, N=never> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? Y : N;

export type IfEq<T, U, Y, N> = IfEquals<T, U, Y, N>

export type AndEquals<A, ARef, B, BRef, Y = unknown, N = never> = IfEquals<A, ARef, IfEquals<B, BRef, Y, N>, N>
