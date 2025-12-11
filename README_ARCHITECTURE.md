# Absher Pro Delegation – Technical Architecture

## High-Level Overview
Absher Pro Delegation هو تطبيق ويب (Next.js/React) يوفر إدارة التفويض لدورين (المانح والمفوَّض) مع طبقة تجريد للمنصات (أبشر، أبشر أعمال، ناجز)، مساعد AI، تبويب تحليلات وإمكانية وصول. التكامل مع المنصات الحكومية يمكن أن يُحاكى حالياً عبر محولات (adapters) أو خدمات وهمية.

## Architecture Diagram (Mermaid)
```mermaid
graph TD
  A[Client: Web/Mobile] -->|UI actions| B[Web App (Next.js/React)]
  B -->|CRUD/Status| C[Delegation API]
  B -->|AI prompts| D[AI Orchestration]
  B -->|Analytics events| E[Analytics Aggregator]
  C --> F[(DB: delegations, users, prefs, analytics)]
  D --> F
  E --> F
  A <-->|Updates/Views| B
```

## Runtime Components
**Frontend**
- TypeScript + React/Next.js + Tailwind (RTL).
- صفحات/مسارات: Home، Delegations، As-Delegate، Analytics، Accessibility، AI panel.
- مكوّنات: DelegationCard، DelegationWizard، TermsAndConditionsPanel، DelegateListView، AnalyticsCharts، AccessibilityPanel، FloatingMicButton، FloatingAIButton/ChatPanel.

**API / Server Logic**
- نقاط CRUD للتفويض.
- تحديثات الحالة (accept/reject/archive/delete).
- تجريد المنصة: سجل خدمات لكل منصة (أبشر، أبشر أعمال، ناجز).
- نقاط مساعد AI تستدعي مزود LLM وتحوّل الاستجابة إلى نموذج التفويض.

## Data Model
هيكل `delegation` المقترح:
- id
- platform (Absher | AbsherBusiness | Najiz)
- serviceId, serviceNameAr, serviceNameEn, isDigitalService
- grantorId, grantorName
- delegateId, delegateName, delegatePhone
- durationType (24h | 7d | custom)
- startAt, endAt
- status (pending | active | completed | rejected | expired)
- delegateStatus
- delegateAcceptedAt
- isArchivedForGrantor, isArchivedForDelegate
- isDeletedForGrantor, isDeletedForDelegate
- createdAt, updatedAt
- تفضيلات المستخدم: اللغة، حجم الخط، تباين عالٍ

## Security & Roles
- أدوار: مستخدم عادي (قد يكون مانحاً أو مفوَّضاً)، مشرف اختياري للتحليلات.
- جلسات محمية ومسارات خاصة للبيانات الحساسة.
- توسع مستقبلي: MFA، SSO مع موفر هوية حكومي.

## Testing
- وحدات: نموذج التفويض والمحدّدات (reducers).
- تكامل: معالج التفويض وتدفق القبول/الرفض.
- E2E (Playwright):
  - إنشاء تفويض كمانح.
  - عرض وقبول كمفوَّض.
  - أرشفة/حذف.
  - التحقق من الأرقام في التحليلات.

## Environments
- تطوير محلي.
- بيئة تجريبية (اختياري).
- اقتراح CI: lint + test + build.

## Future Extensions
- تكاملات إنتاجية مع أبشر/ناجز.
- سجلات تدقيق وتنبيهات.
- تصدير بيانات وتقارير.
