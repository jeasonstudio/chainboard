import QRCodeUtil from 'qrcode';
import React, { ButtonHTMLAttributes, ReactElement, useMemo } from 'react';
import { cn } from '../lib/utils';

const generateMatrix = (
  value: string,
  errorCorrectionLevel: QRCodeUtil.QRCodeErrorCorrectionLevel
) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  );
};

export interface QRCodeProps extends React.SVGAttributes<SVGSVGElement> {
  ecl?: QRCodeUtil.QRCodeErrorCorrectionLevel;
  size?: number;
  uri: string;
  clearArea?: boolean;
  image?: React.ReactNode;
  imageBackground?: string;
  loading?: boolean;
}

export const QRCode = React.forwardRef<SVGSVGElement, QRCodeProps>(
  (
    {
      ecl = 'M',
      size: sizeProp = 200,
      uri,
      clearArea = false,
      image,
      imageBackground = 'transparent',
      className,
      loading,
      ...props
    },
    ref
  ) => {
    const logoSize = clearArea ? 76 : 0;
    const size = sizeProp - 10 * 2;

    const dots = useMemo(() => {
      const dots: ReactElement[] = [];
      const matrix = generateMatrix(uri, ecl);
      const cellSize = size / matrix.length;
      let qrList = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ];

      qrList.forEach(({ x, y }) => {
        const x1 = (matrix.length - 7) * cellSize * x;
        const y1 = (matrix.length - 7) * cellSize * y;
        for (let i = 0; i < 3; i++) {
          dots.push(
            <rect
              key={`${i}-${x}-${y}`}
              fill={
                i % 2 !== 0 || loading
                  ? 'hsl(var(--background))'
                  : 'hsl(var(--foreground))'
              }
              rx={(i - 2) * -5 + (i === 0 ? 2 : 3)}
              ry={(i - 2) * -5 + (i === 0 ? 2 : 3)}
              width={cellSize * (7 - i * 2)}
              height={cellSize * (7 - i * 2)}
              x={x1 + cellSize * i}
              y={y1 + cellSize * i}
            />
          );
        }
      });

      if (image) {
        const x1 = (matrix.length - 7) * cellSize * 1;
        const y1 = (matrix.length - 7) * cellSize * 1;
        dots.push(
          <>
            <rect
              fill={imageBackground}
              rx={(0 - 2) * -5 + 2}
              ry={(0 - 2) * -5 + 2}
              width={cellSize * (7 - 0 * 2)}
              height={cellSize * (7 - 0 * 2)}
              x={x1 + cellSize * 0}
              y={y1 + cellSize * 0}
            />
            <foreignObject
              width={cellSize * (7 - 0 * 2)}
              height={cellSize * (7 - 0 * 2)}
              x={x1 + cellSize * 0}
              y={y1 + cellSize * 0}
            >
              <div
                style={{ borderRadius: (0 - 2) * -5 + 2, overflow: 'hidden' }}
              >
                {image}
              </div>
            </foreignObject>
          </>
        );
      }

      const clearArenaSize = Math.floor((logoSize + 25) / cellSize);
      const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
      const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

      matrix.forEach((row: QRCodeUtil.QRCode[], i: number) => {
        row.forEach((_: any, j: number) => {
          if (matrix[i][j]) {
            // Do not render dots under position squares
            if (
              !(
                (i < 7 && j < 7) ||
                (i > matrix.length - 8 && j < 7) ||
                (i < 7 && j > matrix.length - 8)
              )
            ) {
              //if (image && i > matrix.length - 9 && j > matrix.length - 9) return;
              if (
                image ||
                !(
                  i > matrixMiddleStart &&
                  i < matrixMiddleEnd &&
                  j > matrixMiddleStart &&
                  j < matrixMiddleEnd
                )
              ) {
                dots.push(
                  <circle
                    key={`circle-${i}-${j}`}
                    cx={i * cellSize + cellSize / 2}
                    cy={j * cellSize + cellSize / 2}
                    fill={
                      loading
                        ? 'hsl(var(--background))'
                        : 'hsl(var(--foreground))'
                    }
                    r={cellSize / 3}
                  />
                );
              }
            }
          }
        });
      });

      return dots;
    }, [ecl, image, imageBackground, logoSize, size, uri, loading]);

    return (
      <svg
        {...props}
        className={cn(className)}
        ref={ref}
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: size,
          height: size,
        }}
      >
        <rect fill="transparent" height={size} width={size} />
        {dots}
      </svg>
    );
  }
);
QRCode.displayName = 'QRCode';
