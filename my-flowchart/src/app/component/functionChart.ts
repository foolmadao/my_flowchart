export class FunctionFlow {
  name: string;
  next: FunctionFlow[] = [];

  setName(name: string) {
    this.name = name;
  }

  setNext(next: FunctionFlow) {
    if (this.next.find(item => item.name === next.name)) {
      return;
    }
    this.next.push(next);
  }

  deleteNext(next: FunctionFlow) {
    const index = this.next.findIndex(item => item.name === next.name);
    this.next.splice(index, 1);
  }

  constructor(name, next?) {
    this.name = name;
    if (next) {
      this.next = next;
    }
  }
}
