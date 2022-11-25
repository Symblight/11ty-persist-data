import { LitElement, html, css } from "lit";
import { $db, request } from "../../features/store/model";

class ProfileCard extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
    this.profile = null;
    this.loading = true;
    this.db = null;
  }

  static get properties() {
    return {
      profile: { type: String },
      loading: { type: Boolean },
      db: { type: Object },
    };
  }

  static properties = {
    profile: { state: true },
    loading: { state: true },
    db: { state: true },
  };

  store_update_handler(currentState) {
    if (!currentState) return;
    this.db = currentState;
  }

  /**
   * Subscribes to the store.
   */
  useStore() {
    $db.watch(this.store_update_handler.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.useStore();
    this.getUser();
  }

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  async setUserToDb(profile) {
    if (!this.db) {
      return;
    }
    await request.set({
      store: "profile",
      value: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        maidenName: profile.maidenName,
        id: profile.id,
        email: profile.email,
      },
    });
  }

  updated(changedProperties) {
    if (this.db) {
      if (!this.profile) {
        this.getUserFromDB();
      } else {
        this.removeAllChildNodes(this.children[0]);
        this.setUserToDb(this.profile);
      }
    }
  }

  async getUserFromDB() {
    if (!this.db) {
      return;
    }
    const profile = await request.get({ store: "profile", key: 2 });
    this.profile = profile;
    this.loading = false;
  }

  async removeUserFromDb() {
    if (!this.db) {
      return;
    }
    // await request.remove({ store: "profile", key: 3 });
    await request.removeStore("profile");
  }

  async getUser() {
    const profile = await fetch("https://dummyjson.com/users/2").then((res) =>
      res.json()
    );
    this.profile = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      maidenName: profile.maidenName,
      id: profile.id,
      email: profile.email,
      comment: "FETCHED",
    };
  }

  render() {
    if (this.loading) {
      return
    }
    return html`
      <div class="fields">
        <div class="field">
          <span>First name:</span>
          <span>${this.profile?.firstName}</span>
        </div>
        <div class="field">
          <span>Last name:</span>
          <span>${this.profile?.lastName}</span>
        </div>
        <div class="field">
          <span>Middle name:</span>
          <span>${this.profile?.maidenName}</span>
        </div>
        <div class="field">
          <span>Email name:</span>
          <span>${this.profile?.email}</span>
        </div>
      </div>
    `;
  }
}

customElements.define("wb-profile-card", ProfileCard);
