import { LitElement, html, css } from "lit";

class ProfilePosts extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
    this.posts = [];
  }

  static get properties() {
    return {
      posts: { type: Array },
      loading: { type: Boolean },
    };
  }

  static properties = {
    posts: { state: true },
    loading: { state: true },
  };

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.getPosts();
  }

  async getPosts() {
    const res = await fetch(
      "https://dummyjson.com/posts?limit=3&skip=10&"
    ).then((res) => res.json());
    this.removeAllChildNodes(this.children[0]);
    this.posts = res.posts;
    this.loading = false;
  }

  render() {
    return html`
      <div class="posts">
        ${this.posts.map(
          (post) => html`<a class="card" href="/posts/${post.id}">
            <span>${post.title}</span>
            <p>${post.body}</p>
          </a>`
        )}
      </div>
    `;
  }
}

customElements.define("wb-profile-posts", ProfilePosts);
