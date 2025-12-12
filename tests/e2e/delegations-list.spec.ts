import { expect, test } from "@playwright/test";

test.describe("Delegations list (delegate view)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/delegate");
  });

  test("renders cards with details and opens a delegation", async ({ page }) => {
    await expect(page.getByText("تفويضاتي كمفوَّض")).toBeVisible();

    await expect(page.getByText("نشط")).toBeVisible();
    await expect(page.getByText("قيد الموافقة")).toBeVisible();
    await expect(page.getByText("مكتمل")).toBeVisible();

    const cards = page.getByRole("button", { name: "عرض التفاصيل" });
    expect(await cards.count()).toBeGreaterThan(0);

    const pendingCard = page
      .getByText("تمثيل في قضية")
      .first()
      .locator("xpath=ancestor::div[contains(@class,'card')]")
      .first();
    await pendingCard.getByRole("button", { name: "عرض التفاصيل" }).click();

    const modal = page
      .getByRole("button", { name: "Close" })
      .locator("xpath=ancestor::div[contains(@class,'fixed')]")
      .first();
    await expect(modal).toBeVisible();

    await expect(modal.getByText("سعود العتيبي").first()).toBeVisible();
    await expect(modal.getByText("0559876543")).toBeVisible();
    await expect(modal.getByText("الشروط والأحكام", { exact: true }).first()).toBeVisible();
    await expect(modal.getByRole("button", { name: "قبول" })).toBeVisible();
    await expect(modal.getByRole("button", { name: "رفض" })).toBeVisible();
  });
});
