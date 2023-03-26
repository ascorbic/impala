import React, { createContext, ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

class HeadProvider {
  private head: React.ReactElement[] = [];

  private removeTag(tag: string) {
    this.head = this.head.filter((item) => item.type !== tag);
  }

  public addHead(head?: ReactElement | ReactElement[]) {
    if (!head) {
      return;
    }
    if (Array.isArray(head)) {
      // Can't have more than one title tag
      if (head.some((item) => item.type === "title")) {
        this.removeTag("title");
      }
      this.head.push(...head);
      return;
    }

    if (head.type === "title") {
      this.removeTag("title");
    }
    this.head.push(head);
  }

  public getHead() {
    return this.head;
  }

  public getAsString() {
    return renderToStaticMarkup(<>{...this.head}</>);
  }
}

const headProvider = new HeadProvider();

export const HeadContext = createContext(headProvider);
