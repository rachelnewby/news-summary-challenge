class NewsView {
  constructor(model, client) {
    this.model = model;
    this.client = client;

    this.mainContainerEl = document.querySelector("#main-container");
    this.searchButton = document.querySelector("#news-search-button");

    this.searchButton.addEventListener("click", () => {
      const searchTerm = document.querySelector("#news-search-input").value;
      document.querySelector("#news-search-input").value = "";
      this.displayTopicArticles(searchTerm);
    })
  }

  displayArticles() {
    const existingArticles = document.querySelectorAll(".article");
    existingArticles.forEach(story => story.remove());

    const articles = this.model.getArticles();
    articles.forEach((article) => {
      const divEl = document.createElement("div");
      divEl.className = "article";
      const paraEl = document.createElement("p");
      paraEl.textContent = article.fields.headline;
      divEl.append(paraEl);
      const imageEl = document.createElement("img")
      imageEl.src = article.fields.thumbnail;
      divEl.append(imageEl);
      const linkEl = document.createElement("a");
      linkEl.innerHTML = "Read more";
      linkEl.href = article.webUrl;
      divEl.append(linkEl);
      this.mainContainerEl.append(divEl);
    })
  }

  displayArticlesFromApi() {
    return this.client.loadArticles()
      .then((articles) => {
        this.model.reset();
        this.model.setArticles(articles);
        this.displayArticles();
      }).catch(() => this.displayError())
  }

  displayTopicArticles(topic) {
    return this.client.loadTopicArticles(topic)
      .then((articles) => {
        this.model.reset();
        this.model.setArticles(articles);
        this.displayArticles();
      }).catch(() => this.displayError())
  }

  displayError() {
    const existingArticles = document.querySelectorAll(".article");
    existingArticles.forEach(story => story.remove());
    const existingErrorMessages = document.querySelectorAll(".error-message");
    existingErrorMessages.forEach(message => message.remove())
    const errorEl = document.createElement("div");
    errorEl.textContent = "Oopsy daisy, something's gone amiss!";
    errorEl.className = "error-message";
    this.mainContainerEl.append(errorEl)
  }
}

module.exports = NewsView;