/**
 * Largest-Triangle-Three-Buckets (LTTB) algorithm implementation for downsampling.
 * This preserves the visual characteristics of the time series (peaks, valleys).
 */
export type DataPoint = [Date | number, number];

export function downsampleLTTB(data: DataPoint[], threshold: number): DataPoint[] {
  const dataLength = data.length;
  if (threshold >= dataLength || threshold === 0) {
    return data; // No need to downsample
  }

  const sampled: DataPoint[] = [];
  let sampledIndex = 0;

  // Bucket size. Leave room for start and end data points
  const bucketSize = (dataLength - 2) / (threshold - 2);

  let a = 0; // Initially a is the first point in the triangle
  let maxAreaPoint: DataPoint = data[0];
  let maxArea = -1;
  let area = -1;
  let nextA = 0;

  sampled[sampledIndex++] = data[a]; // Always add the first point

  for (let i = 0; i < threshold - 2; i++) {
    // Calculate point average for next bucket (containing c)
    let avgX = 0;
    let avgY = 0;
    let avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    let avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;

    const avgRangeLength = avgRangeEnd - avgRangeStart;

    for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
      avgX += (data[avgRangeStart][0] as any) instanceof Date 
        ? (data[avgRangeStart][0] as Date).getTime() 
        : (data[avgRangeStart][0] as number);
      avgY += Number(data[avgRangeStart][1]);
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;

    // Get the range for this bucket
    let rangeOffs = Math.floor(i * bucketSize) + 1;
    const rangeTo = Math.floor((i + 1) * bucketSize) + 1;

    // Point a
    const pointAX = (data[a][0] as any) instanceof Date 
        ? (data[a][0] as Date).getTime() 
        : (data[a][0] as number);
    const pointAY = Number(data[a][1]);

    maxArea = area = -1;

    for (; rangeOffs < rangeTo; rangeOffs++) {
      // Calculate triangle area over three buckets
      const pointX = (data[rangeOffs][0] as any) instanceof Date 
        ? (data[rangeOffs][0] as Date).getTime() 
        : (data[rangeOffs][0] as number);
      const pointY = Number(data[rangeOffs][1]);

      area = Math.abs(
        (pointAX - avgX) * (pointY - pointAY) -
          (pointAX - pointX) * (avgY - pointAY)
      ) * 0.5;

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[rangeOffs];
        nextA = rangeOffs; // Next a is this b
      }
    }

    sampled[sampledIndex++] = maxAreaPoint; // Pick this point from the bucket
    a = nextA; // This bucket's char point becomes next bucket's a
  }

  sampled[sampledIndex++] = data[dataLength - 1]; // Always add last

  return sampled;
}

export default { downsampleLTTB };
