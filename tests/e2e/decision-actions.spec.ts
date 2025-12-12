import { expect, Page, test } from "@playwright/test";

const openPendingDelegation = async (page: Page, serviceText = "تمثيل في قضية") => {
  await page.goto("/delegate");
  await page.getByText(serviceText).first().click();
};

const switchToEnglish = async (page: Page) => {
  await page.getByLabel("Switch to English").click();
};

test.describe("Accept / Reject delegation", () => {
  test("accepts a pending delegation", async ({ page }) => {
    await openPendingDelegation(page);

    const acceptButton = page.getByRole("button", { name: "قبول" });
    await acceptButton.click();

    const updatedCard = page
      .getByText("تمثيل في قضية")
      .first()
      .locator("xpath=ancestor::div[contains(@class,'card')]")
      .first();
    await expect(updatedCard.getByText("نشط").first()).toBeVisible();
  });

  test("rejects a pending delegation", async ({ page }) => {
    await openPendingDelegation(page);

    await page.getByRole("button", { name: "رفض" }).click();

    await expect(page.getByText("مرفوض")).toBeVisible();
  });
});

test.describe("RTL consent alignment", () => {
  test("consent text stays on one line with RTL alignment", async ({ page }) => {
    await openPendingDelegation(page);

    const consentNotice = page.getByText("بالمتابعة، أنت توافق على الشروط والأحكام الخاصة بهذا التفويض.");
    await expect(consentNotice).toBeVisible();
    await expect(consentNotice).toHaveCSS("text-align", "right");

    const consentContainer = consentNotice.locator("xpath=ancestor::div[@dir][1]");
    await expect(consentContainer).toHaveAttribute("dir", "rtl");
  });

  test("shows consent notice in English with LTR alignment", async ({ page }) => {
    await page.goto("/delegate");
    await switchToEnglish(page);
    await page.getByText("Case representation").first().click();

    const consentNotice = page.getByText("By proceeding, you agree to the terms and conditions of this delegation.");
    await expect(consentNotice).toBeVisible();

    const consentContainer = consentNotice.locator("xpath=ancestor::div[@dir][1]");
    await expect(consentContainer).toHaveAttribute("dir", "ltr");

    const acceptButton = page.getByRole("button", { name: "Accept" });
    await expect(acceptButton).toBeEnabled();
  });
});
