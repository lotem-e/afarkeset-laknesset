// =========================================================
// The seat-map math, kept pure ( no React ) so it can be
// tested from node and reasoned about on its own.
//
// A hemicycle is rows of concentric half-circles. The steps:
//   1. Spread the rows between an inner and an outer radius.
//   2. Give each row a share of the 120 seats proportional to
//      its radius ( longer arc = more seats ), using the
//      largest-remainder method so the total stays exact.
//   3. Place each row's seats at even angles from 0 ( right
//      edge ) to PI ( left edge ).
//   4. Sort ALL seats by angle. Filling parties in that order
//      is what creates the clean pie-like wedges: a party
//      occupies a contiguous angular slice across every row.
//
// Angle convention: 0 = right edge, PI = left edge. We fill from
// the right, which in a RTL Hebrew page is where reading starts -
// the coalition therefore always grows out of the right edge.
// =========================================================

export interface SeatPos {
  x: number; // relative to the arc center
  y: number; // negative = above the center ( SVG y grows down )
  theta: number;
  row: number;
}

export function hemicycleSeats(
  total: number,
  rows: number,
  innerRadius: number,
  outerRadius: number
): SeatPos[] {
  // 1. Row radii, evenly spaced inner -> outer.
  const radii = Array.from(
    { length: rows },
    (_, i) => innerRadius + ((outerRadius - innerRadius) * i) / (rows - 1)
  );

  // 2. Apportion seats to rows by radius ( largest remainder ).
  const radiusSum = radii.reduce((a, b) => a + b, 0);
  const quotas = radii.map((r) => (total * r) / radiusSum);
  const counts = quotas.map((q) => Math.floor(q));
  let remaining = total - counts.reduce((a, b) => a + b, 0);
  const byRemainder = quotas
    .map((q, i) => ({ i, frac: q - Math.floor(q) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remaining; k++) counts[byRemainder[k].i]++;

  // 3. Place seats row by row.
  const seats: SeatPos[] = [];
  radii.forEach((r, row) => {
    const n = counts[row];
    for (let k = 0; k < n; k++) {
      // n - 1 gaps span the half circle; a lone seat sits at the top
      const theta = n === 1 ? Math.PI / 2 : (Math.PI * k) / (n - 1);
      seats.push({
        theta,
        row,
        x: r * Math.cos(theta),
        y: -r * Math.sin(theta),
      });
    }
  });

  // 4. Fill order: right edge first ( theta ascending ), inner
  // rows first on near-ties so wedge borders stay straight.
  seats.sort((a, b) => a.theta - b.theta || a.row - b.row);
  return seats;
}
