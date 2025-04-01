const { test, expect } = require("@playwright/test");
const CableGuyPage = require("../pages/cableGuyPage");

test.describe("CableTests", () => {
  
  let cablePage;

  test.beforeEach(async ({ page }) => {
    cablePage = new CableGuyPage(page);
  });

  test("Navigate through CableGuy page and add product to basket", async ({ page }) => {
    
    // Step: Navigate to CableGuy Page
    await cablePage.navigateToCableGuy();

    // Step: Handle Cookie Banner
    await cablePage.handleCookieBanner();

    // Step: Select Random Cable Beginning
    await cablePage.selectRandomCableBeginning();

    // Step: Select Random Cable End
    await cablePage.selectRandomCableEnd();

    // Step: Select Random Manufacturer & Validate Count
    await cablePage.selectRandomManufacturer();
    
    const expectedProductCount = await cablePage.getManufacturerCount();
    
    const actualProductCount = await cablePage.getTotalProductCount();

    // Assert: Validate Product Counts Match
    expect(actualProductCount).toEqual(expectedProductCount);

    // Step: Select Random Product & Validate Details Page
    const randomProductName = await cablePage.selectRandomProduct();
    
    const selectedProductName = await cablePage.selectedProductTitle();
    
    expect(randomProductName).toBe(selectedProductName);

    // Step: Add Product to Basket & Validate Notification Popup
    await cablePage.addToBasket();
    
  });
});
