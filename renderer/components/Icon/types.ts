import { ReactNode } from "react";

export type IconItem = {
  svg: (props: CustomIcon) => JSX.Element;
}

export type CustomIcon = {
  name: string;
  color: string;
  size?: string;
};

export type CustomSvg = {
  children: ReactNode; 
  name: string; 
  color: string; 
  size: string;
  viewBox?: string;
}
