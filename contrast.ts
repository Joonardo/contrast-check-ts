import { Byte, R, G, B, Dot055 } from './luminance';

type Num = unknown[];
type Sum<A extends Num, B extends Num> = [...A, ...B];

type Diff<A extends Num, B extends Num> = B extends [infer _, ...infer BR]
  ? A extends [infer _, ...infer AR]
  ? Diff<AR, BR>
  : never
  : A;

type GE<A extends Num, B extends Num> = B extends [infer _, ...infer BR]
  ? A extends [infer _, ...infer AR]
  ? GE<AR, BR>
  : false
  : true;

type Max<A extends Num, B extends Num> = GE<A, B> extends true ? A : B;

type Div<R extends Num, D extends Num, Q extends Num = []> = GE<R, D> extends true
  ? Div<Diff<R, D>, D, Sum<Q, [0]>>
  : Q;

type L<Rb extends Byte, Gb extends Byte, Bb extends Byte> = Sum<Sum<R<Rb>, G<Gb>>, B<Bb>>;

type _Cont<R1 extends Byte, G1 extends Byte, B1 extends Byte, R2 extends Byte, G2 extends Byte, B2 extends Byte> = Div<
  Sum<L<R2, G2, B2>, Dot055>,
  Sum<L<R1, G1, B1>, Dot055>
>;

type _Contrast<R1 extends Byte, G1 extends Byte, B1 extends Byte, R2 extends Byte, G2 extends Byte, B2 extends Byte> = Max<
  _Cont<R1, G1, B1, R2, G2, B2>,
  _Cont<R2, G2, B2, R1, G1, B1>
>;

type Color = [Byte, Byte, Byte];

type RequiredRatio = [0, 0, 0, 0, 0, 0, 0];
type IsFine<CR extends Num> = GE<CR, RequiredRatio>;

type _ContrastChecked<R1 extends Byte, G1 extends Byte, B1 extends Byte, R2 extends Byte, G2 extends Byte, B2 extends Byte> = IsFine<_Contrast<R1, G1, B1, R2, G2, B2>>;

type ContrastChecked<C1 extends Color, C2 extends Color> = C1 extends [infer R1 extends Byte, infer G1 extends Byte, infer B1 extends Byte]
  ? C2 extends [infer R2 extends Byte, infer G2 extends Byte, infer B2 extends Byte]
  ? _ContrastChecked<R1, G1, B1, R2, G2, B2> extends true
  ? [C1, C2]
  : never
  : never
  : never

type Contrast<C1 extends Color, C2 extends Color> = C1 extends [infer R1 extends Byte, infer G1 extends Byte, infer B1 extends Byte]
  ? C2 extends [infer R2 extends Byte, infer G2 extends Byte, infer B2 extends Byte]
  ? _Contrast<R1, G1, B1, R2, G2, B2>
  : never
  : never

type C = Contrast<['FF', '00', '00'], ['00', 'FF', '00']>;

type RedVsGreen = ContrastChecked<['FF', '00', '00'], ['00', 'FF', '00']>;
