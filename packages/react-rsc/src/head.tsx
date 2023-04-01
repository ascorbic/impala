import { useContext } from "react";
import { HeadContext } from "./head-context";

interface HeadProps {
  title?: string;
  children?: React.ReactElement | React.ReactElement[];
}

export const Head: React.FC<HeadProps> = ({ children, title }) => {
  const headProvider = useContext(HeadContext);
  headProvider.addHead(children);
  if (title) {
    headProvider.addHead(<title>{title}</title>);
  }
  return null;
};
