import { createContext, VNode } from "preact";
import render from "preact-render-to-string";

class HeadProvider {
  private head: VNode<any>[] = [];

  private removeTag(tag: string) {
    this.head = this.head.filter((item) => item.type !== tag);
  }

  public addHead(head?: VNode<any> | VNode<any>[]) {
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
    return render(<>{...this.head}</>);
  }
}

const headProvider = new HeadProvider();

export const HeadContext = createContext(headProvider);
