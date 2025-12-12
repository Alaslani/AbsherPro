import { expect, test, Page } from "@playwright/test";

const openAccessibility = async (page: Page) => {
  await page.goto("/accessibility");
};

test.describe("Verified agent flow", () => {
  test("requires location and shows cost in Arabic", async ({ page }) => {
    await openAccessibility(page);

    await page.getByRole("button", { name: "طلب مندوب موثّق" }).click();

    await expect(page.getByText("تكلفة الخدمة: ٢٠٠ ﷼")).toBeVisible();

    const confirmButton = page.getByRole("button", { name: "تأكيد الطلب" });
    await expect(confirmButton).toBeDisabled();

    await page.getByRole("button", { name: "استخدام موقعي الحالي" }).click();
    await expect(page.getByText("تم حفظ موقعك الحالي.")).toBeVisible();
    await expect(confirmButton).toBeEnabled();

    await confirmButton.click();
    await expect(page.getByText("تم إرسال الطلب وسيتواصل معك المندوب قريباً.")).toBeVisible();
  });

  test("shows English copy, cost, and location gate", async ({ page }) => {
    await openAccessibility(page);
    await page.getByLabel("Switch to English").click();

    await page.getByRole("button", { name: "Request a verified agent" }).click();

    await expect(page.getByText("Service cost: 200 ﷼")).toBeVisible();
    const confirmButton = page.getByRole("button", { name: "Confirm request" });
    await expect(confirmButton).toBeDisabled();

    await page.getByRole("button", { name: "Use my current location" }).click();
    await expect(page.getByText("Your current location has been captured.")).toBeVisible();
    await expect(confirmButton).toBeEnabled();

    await confirmButton.click();
    await expect(page.getByText("Request sent. An agent will contact you shortly.")).toBeVisible();
  });
});

test.describe("Input normalization", () => {
  test("normalizes Arabic numerals to English for ID and phone", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "إنشاء تفويض جديد" }).click();
    await page.getByRole("button", { name: /استلام جواز السفر/ }).click();
    await page.getByRole("button", { name: "التالي" }).click();

    await page.getByPlaceholder("محمد أحمد").fill("مفوَّض تجريبي");
    await page.getByPlaceholder("1234567890").fill("٠١٢٣٤٥٦٧٨٩٠");
    await expect(page.getByPlaceholder("1234567890")).toHaveValue("0123456789");

    await page.getByPlaceholder("05xxxxxxxx").fill("٠٥١٢٣٤٥٦٧٨");
    await expect(page.getByPlaceholder("05xxxxxxxx")).toHaveValue("0512345678");
  });
});
