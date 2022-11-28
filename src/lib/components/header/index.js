import { LitElement, html } from "lit";
import auth0 from "auth0-js";

var options = {
  method: "POST",
  url: "https://dev-n35y1wl2t7qzpheb.eu.auth0.com/oauth/token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  data: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: "Rt4JEn0pSXcHGaxpOd65WlglW1MAnwzY",
    client_secret:
      "48KzYdFDekt-6a2U3C4K0tlDEEt60sVe3Hi3HBHCnSJiR0X3fMqCgcRKtc0GEP6f",
    audience: "YOUR_API_IDENTIFIER",
  }),
};

class Header extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
    this.signIn = false;
    this.pending = true;
    this.getUser();
  }

  static get properties() {
    return {
      signIn: { type: Boolean },
      pending: { type: Boolean },
    };
  }

  static properties = {
    signIn: { state: true },
    pending: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
  }

  async getUser() {
    try {
      const rawResponse = await fetch("http://localhost:8080/api/v1/profile", {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const profile = await rawResponse.json();
      this.signIn = true;
    } catch (e) {
    } finally {
      this.pending = false;
    }
  }

  getLinks() {
    if (this.pending) {
      return;
    }
    if (!this.signIn) {
      return html`<a href="/login">Login</a>`;
    }
    return html`<a href="/logout">Logout</a>`;
  }

  render() {
    return html`<div class="right-side">${this.getLinks()}</div> `;
  }
}

customElements.define("wb-header-app", Header);
