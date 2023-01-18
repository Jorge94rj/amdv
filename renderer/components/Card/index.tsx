import React, { ReactNode } from "react"
import { CardContainer } from "./index.style"

interface CardProps {
  clickable?: boolean;
  action?: () => void;
  children: ReactNode;
}

const Card = ({ clickable, action, children }: CardProps) => {
  return (
    <CardContainer clickable={clickable} onClick={action}>
      {children}
    </CardContainer>
  )
}

export default Card