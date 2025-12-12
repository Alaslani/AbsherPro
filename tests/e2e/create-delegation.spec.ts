import { expect, test } from "@playwright/test";

test.describe("Create Delegation Flow", () => {
  test("creates a delegation, views terms, and accepts", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "إنشاء تفويض جديد" }).click();

    await page.getByRole("button", { name: /استلام جواز السفر/ }).click();
    await page.getByRole("button", { name: "التالي" }).click();

    await page.getByPlaceholder("محمد أحمد").fill("مفوَّض تجريبي");
    await page.getByPlaceholder("1234567890").fill("1234567890");
    await page.getByPlaceholder("05xxxxxxxx").fill("0555555555");
    await page.getByRole("button", { name: "مراجعة" }).click();

    await page.getByRole("button", { name: "تأكيد التفويض" }).click();
    await expect(page.getByText("تم إنشاء التفويض بنجاح")).toBeVisible();

    await page.getByRole("link", { name: "كمفوَّض" }).click();

    const newCard = page.getByText("استلام جواز السفر").first();
    const newCardContainer = newCard.locator("xpath=ancestor::div[contains(@class,'card')]").first();
    await newCardContainer.getByRole("button", { name: "عرض التفاصيل" }).click();

    const modal = page
      .getByRole("button", { name: "Close" })
      .locator("xpath=ancestor::div[contains(@class,'fixed')]")
      .first();
    await expect(modal).toBeVisible();
    await expect(modal.getByText("الشروط والأحكام", { exact: true }).first()).toBeVisible();
    await expect(modal.getByText("الالتزام باستخدام بيانات التفويض", { exact: false })).toBeVisible();
    await modal.getByRole("button", { name: "قبول" }).click();

    await expect(newCardContainer.getByText("نشط").first()).toBeVisible();
  });
});
