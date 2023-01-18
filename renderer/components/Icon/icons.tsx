import { CustomIcon, CustomSvg, IconItem } from "./types";

export const Icons = {
  upload: {
    svg: ({ name, color, size }: CustomIcon) =>
    (<CustomSvg
      name={name}
      color={color}
      size={size ?? '48'}
    >
      <path d="M11 40q-1.2 0-2.1-.9Q8 38.2 8 37v-7.15h3V37h26v-7.15h3V37q0 1.2-.9 2.1-.9.9-2.1.9Zm11.5-7.65V13.8l-6 6-2.15-2.15L24 8l9.65 9.65-2.15 2.15-6-6v18.55Z" />
    </CustomSvg>)
  } as IconItem,
  search: {
    svg: ({ name, color, size }: CustomIcon) =>
    (<CustomSvg
      name={name}
      color={color}
      size={size ?? '48'}
    >
      <path d="M4 38v-3h20v3Zm0-10.5v-3h10v3ZM4 17v-3h10v3Zm37.9 21-8-8q-1.3 1-2.8 1.5-1.5.5-3.1.5-4.15 0-7.075-2.925T18 22q0-4.15 2.925-7.075T28 12q4.15 0 7.075 2.925T38 22q0 1.6-.5 3.1T36 27.9l8 8ZM28 29q2.9 0 4.95-2.05Q35 24.9 35 22q0-2.9-2.05-4.95Q30.9 15 28 15q-2.9 0-4.95 2.05Q21 19.1 21 22q0 2.9 2.05 4.95Q25.1 29 28 29Z" />
    </CustomSvg>)
  } as IconItem,
  palette: {
    svg: ({ name, color, size }: CustomIcon) =>
    (<CustomSvg
      name={name}
      color={color}
      size={size ?? '48'}
    >
      <path d="M24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.25 1.6-7.9 1.6-3.65 4.375-6.35 2.775-2.7 6.5-4.225Q20.2 4 24.45 4q3.95 0 7.5 1.325T38.175 9q2.675 2.35 4.25 5.575Q44 17.8 44 21.65q0 5.4-3.15 8.525T32.5 33.3h-3.75q-.9 0-1.55.7t-.65 1.55q0 1.35.725 2.3.725.95.725 2.2 0 1.9-1.05 2.925T24 44Zm0-20Zm-11.65 1.3q1 0 1.75-.75t.75-1.75q0-1-.75-1.75t-1.75-.75q-1 0-1.75.75t-.75 1.75q0 1 .75 1.75t1.75.75Zm6.3-8.5q1 0 1.75-.75t.75-1.75q0-1-.75-1.75t-1.75-.75q-1 0-1.75.75t-.75 1.75q0 1 .75 1.75t1.75.75Zm10.7 0q1 0 1.75-.75t.75-1.75q0-1-.75-1.75t-1.75-.75q-1 0-1.75.75t-.75 1.75q0 1 .75 1.75t1.75.75Zm6.55 8.5q1 0 1.75-.75t.75-1.75q0-1-.75-1.75t-1.75-.75q-1 0-1.75.75t-.75 1.75q0 1 .75 1.75t1.75.75ZM24 41q.55 0 .775-.225.225-.225.225-.725 0-.7-.725-1.3-.725-.6-.725-2.65 0-2.3 1.5-4.05t3.8-1.75h3.65q3.8 0 6.15-2.225Q41 25.85 41 21.65q0-6.6-5-10.625T24.45 7q-7.3 0-12.375 4.925T7 24q0 7.05 4.975 12.025Q16.95 41 24 41Z" />
    </CustomSvg>)
  } as IconItem,
  folder: {
    svg: ({ name, color, size }: CustomIcon) =>
    (<CustomSvg
      name={name}
      color={color}
      size={size ?? '48'}
    >
      <path d="M11 36q-1.2 0-2.1-.9Q8 34.2 8 33V7q0-1.2.9-2.1Q9.8 4 11 4h12.25l3 3H43q1.2 0 2.1.9.9.9.9 2.1v23q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h32V10H25l-3-3H11v26Zm29.5 9H5q-1.2 0-2.1-.9Q2 40.2 2 39V10h3v29h35.5ZM16.7 27.45h20.6l-6.6-8.8-5.5 7.3-3.95-4.3ZM11 33V7v26Z" />
    </CustomSvg>)
  } as IconItem,
  home: {
    svg: ({ name, color, size }: CustomIcon) =>
    (<CustomSvg
      name={name}
      color={color}
      size={size ?? '48'}
    >
      <path d="M11 39h7.5V26.5h11V39H37V19.5L24 9.75 11 19.5Zm-3 3V18L24 6l16 12v24H26.5V29.5h-5V42Zm16-17.65Z" />
    </CustomSvg>)
  } as IconItem,
  close: {
    svg: ({ name, color, size }: CustomIcon) =>
    (<CustomSvg
      name={name}
      color={color}
      size={size ?? '48'}
      viewBox="0 0 100 100"
    >
      <path d="m16.5 33.6 7.5-7.5 7.5 7.5 2.1-2.1-7.5-7.5 7.5-7.5-2.1-2.1-7.5 7.5-7.5-7.5-2.1 2.1 7.5 7.5-7.5 7.5ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z" />
    </CustomSvg>)
  } as IconItem,
};

const CustomSvg = ({ children, name, color, size, viewBox }: CustomSvg) => {
  return (
    <svg
      className={`icon icon-${name}`}
      fill={color}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      {...{ viewBox }}
    >
      {children}
    </svg>
  )
}