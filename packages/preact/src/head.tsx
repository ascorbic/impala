import { useContext } from "preact/hooks";
import type { FunctionComponent, VNode } from "preact";
import { HeadContext } from "./head-context";

interface HeadProps {
  title?: string;
  children?: VNode<any> | VNode<any>[];
}

export const Head: FunctionComponent<HeadProps> = ({ children, title }) => {
  const headProvider = useContext(HeadContext);
  headProvider.addHead(children);
  if (title) {
    headProvider.addHead(<title>{title}</title>);
  }
  return null;
};
