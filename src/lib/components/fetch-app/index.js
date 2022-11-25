import { LitElement } from "lit";

class FetchApp extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define("wb-fetch-app", FetchApp);
