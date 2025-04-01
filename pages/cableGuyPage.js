const { test, expect } = require("@playwright/test");

class CableGuyPage {
  constructor(page) {
    this.page = page;
    this.cookieBanner = page.locator(".spicy-consent-bar");
    this.acceptCookiesButton = page.getByRole("button", { name: "small Alright!" });
    this.beginningCable = page.locator(".cg-plugButton--left");
    this.activeCableType = page.locator('.cg-plugmodal__category__item:not(.inactive)');
    this.cableEnd = page.locator(".cg-plugButton--right");
    this.randomCable = page.locator("div.cg-plugItem");
    this.manufacturerOptions = page.locator(".cg-brands__item");
    this.manufacturerCountLocator = page.locator('.cg-brands__item.clicked.active + .cg-brands__item__count');
    this.paginationNextButton = page.locator('button.fx-pagination__pages-button svg.cg-icons__arrow--right');
    this.productList = page.locator(".cg-articles-list .fx-product-list-entry");
    this.article = page.locator(".cg-articles-list .fx-product-list-entry");
    this.productTitleOnDetailPage = page.locator('.fx-content-product__main.product-title h1[itemprop="name"]');
    this.addToBasketButton = page.locator('button.call-to-action__button.fx-button.fx-button--cta');
  }

  // Navigate to CableGuy Page
  async navigateToCableGuy() {
    await this.page.goto("https://www.thomann.de/intl/cableguy.html");
  }

  // Handle Cookie Banner
  async handleCookieBanner() {
    if (await this.cookieBanner.isVisible()) {
      await this.acceptCookiesButton.click();
    }
  }

  // Select a random item from a list
  async selectRandomItem(locator) {
    const count = await locator.count();
    const randomIndex = Math.floor(Math.random() * count);
    await locator.nth(randomIndex).click();
  }

  // Select Random Cable Beginning
  async selectRandomCableBeginning() {
    await this.beginningCable.click();
    await this.selectRandomItem(this.activeCableType);
    await this.selectRandomItem(this.randomCable);
  }

  // Select Random Cable End
  async selectRandomCableEnd() {
    await this.cableEnd.click();
    await this.selectRandomItem(this.activeCableType);
    await this.selectRandomItem(this.randomCable);
  }

  // Select Random Manufacturer
  async selectRandomManufacturer() {
    await this.selectRandomItem(this.manufacturerOptions);

    const countElement = this.page.locator('span.cg-count');
    await expect(countElement).toHaveText(/cables of\s+found/);
  }

  // Get Manufacturer Count
  async getManufacturerCount() {
    const countText = await this.manufacturerCountLocator.textContent();
    return parseInt(countText.trim(), 10);
  }

  // Get Total Product Count Across Pages
  async getTotalProductCount() {
    let totalCount = 0;

    while (true) {
      totalCount += await this.productList.count();

      if (await this.paginationNextButton.isVisible()) {
        await this.paginationNextButton.click();
        await this.page.waitForLoadState('networkidle');
      } else {
        break;
      }
    }

    return totalCount;
  }

  // Select Random Product
  async selectRandomProduct() {
    const count = await this.article.count();
    const randomIndex = Math.floor(Math.random() * count);
    
    const selectedArticle = this.article.nth(randomIndex);
    
    const manufacturer = await selectedArticle.locator('.title__manufacturer').textContent();
    const name = await selectedArticle.locator('.title__name').textContent();

    await selectedArticle.click();

    return `${manufacturer.trim()} ${name.trim()}`;
  }

  // Get Selected Product Title
  async selectedProductTitle() {
     return (await this.productTitleOnDetailPage.textContent()).trim();
  }

  // Add Product to Basket
  async addToBasket() {
     await this.addToBasketButton.click();
     await expect(this.page.locator('.fx-infobox__content.fx-text.fx-notification__content')).toBeVisible();
  }
}

module.exports = CableGuyPage;
