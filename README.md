# Border Screening Frontend

Independent React frontend foundation for a future AI-powered border identity and document screening system. There is no backend dependency at this stage.

## Run locally

Use Node.js 22.13+ within the 22.x release line, or Node.js 24+, and npm. From this directory:

```sh
npm install
npm run dev
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. Vite prints the local development URL. Open `/design-system` on the local Vite URL to inspect the shared component showcase. The root route redirects to `/login`, the demo-only sign-in screen. The Duty Officer dashboard is directly accessible at `/duty-officer/dashboard`, the Live Passenger Queue at `/duty-officer/screening`, Document Capture at `/duty-officer/documents`, demo Automated Screening at `/duty-officer/screening/progress`, and Screening Result at `/duty-officer/screening/result`. Other role-specific application screens remain unimplemented.

```sh
npm run lint
npm run build
npm run preview
```

Copy `.env.example` to `.env` if it is missing. Environment values prefixed with `VITE_` are public browser configuration, never secrets. The initial app-name variable is only a placeholder; no backend URL or credentials are configured.

## Stack

React, Vite, JavaScript/JSX, Tailwind CSS through its Vite plugin, React Router in declarative mode, and lucide-react. ESLint covers JavaScript/JSX and React hooks. No Redux, TypeScript, or server framework is included.

## Architecture

| Directory | Responsibility |
| --- | --- |
| `src/pages/` | Complete screens composed from shared features; no business logic |
| `src/features/` | Shared business functionality across all three roles |
| `src/components/ui/` | Generic reusable controls |
| `src/components/layout/` | Shared shell building blocks |
| `src/components/data-display/` | Shared information presentation |
| `src/components/feedback/` | Shared user feedback |
| `src/layouts/` | Authentication and role-specific shells |
| `src/routes/` | Navigation and future access-control composition |
| `src/services/` | Shared REST and WebSocket communication boundary |
| `src/features/*/services/` | Feature-specific backend operations |
| `src/store/` | Future global frontend state; no state library selected |
| `src/hooks/` | Reusable React behavior |
| `src/constants/` | Fixed application values |
| `src/utils/` | Generic helpers |
| `src/data/` | Temporary fictional demo data |
| `src/config/` | Navigation, role, and application configuration |
| `src/assets/` | Bundled images, icons, and logos |
| `src/styles/` | Global styles and shared utilities |
| `public/` | Static favicon, generic emblem placeholder, and manifest |

## Placeholder contract

- Shared UI, feedback, the demo login, the Duty Officer shell/dashboard, the Live Passenger Queue, local Document Capture, demo Automated Screening Progress, and Screening Result are implemented. Admin and Surveillance interfaces, full operational feature pages, and access-control placeholders remain unimplemented.
- `AppRouter` provides `/login`, a root redirect to `/login`, the temporary `/design-system` showcase, and a blank fallback. Duty Officer routes are mounted without authentication. Admin and Surveillance route lists remain empty. Remove the showcase route before an operational release.
- `ProtectedRoute` and `RoleRoute` do not enforce authentication or authorization. They are inert placeholders, not security controls.
- Hooks, services, stores, configuration, and business helpers remain empty modules. Shared presentation utilities and semantic status labels are implemented without application logic.
- Mock data files provide the fictional Duty Officer dashboard snapshot; `mockReports.js` remains empty. All demo data must remain fictional: never use real passport numbers, biometric information, or personally identifiable information.
- Empty asset and utility directories contain `.gitkeep` files so Git preserves the architecture.
- The favicon and emblem are generic placeholders, not official government branding.

## Future backend boundary

```text
React frontend -> REST API / WebSocket -> Python FastAPI backend -> AI/ML services
```

Keep shared transport in `src/services/` and feature operations in each feature's `services/`. Never call backend endpoints directly from UI components. Keep authentication separate from UI and screening orchestration separate from pages. No network requests, mock API calls, WebSocket connections, authentication, or real screening logic are implemented.

## Design direction

Future screens should use a light theme, white/off-white/light-gray surfaces, government blue/deep navy, restrained green/amber/red statuses, readable typography, accessible enterprise forms and tables, and simple lucide line icons. The shared design system, demo-only login, Duty Officer dashboard, Live Passenger Queue, local Document Capture, demo Automated Screening Progress, and Screening Result are implemented. No Admin/Surveillance screens, production screening workflow, server uploads, charts, maps, business logic, or backend integration are included.


## Design tokens

Tailwind CSS 4 uses the CSS-first `@theme` block in `src/styles/globals.css`; no JavaScript Tailwind configuration is needed. Keep color values in that block, not in components.

- Primary actions: `bg-primary`, `text-primary`, `bg-primary-hover`; deep navy headings: `text-navy`.
- Surfaces: `bg-surface`, `bg-canvas`, `bg-subtle`. Structure: `border-default`; form boundaries: `border-control`.
- Text: `text-ink` for body and `text-muted` for supporting text.
- Semantic tones: `success`, `warning`, `danger`, `info`, `neutral`, with matching `*-soft` backgrounds. Use primarily on badges, icons, borders, and alerts, not whole pages.
- System font stack: Segoe UI, Helvetica Neue, Arial, sans-serif. No external font requests.
- Type scale: `text-page` (28 px), `text-section` (18 px), `text-card` (16 px), `text-body` (14 px), `text-caption` (12 px). Use regular and semibold weights.
- Layout rhythm: `page-shell` gives 16 px mobile / 32 px desktop padding; cards use `p-5`; use 16-24 px content/form gaps and 40 px between major sections.
- Shape: `rounded-control` (4 px), `rounded-panel` (6 px), and `shadow-panel` only where useful.
- Icons: Lucide with `icon-sm` (16 px), `icon-md` (20 px), or `icon-lg` (24 px), all at 1.75 stroke width. Hide decorative icons from assistive technology and label icon-only buttons.

`utilities.css` contains only the shared page container, field styling, and icon-size conventions. Tailwind handles the remaining layout and spacing.

## Component contracts

All shared controls are generic. Local React state exists only for interaction behavior or demonstration; it is not authentication, screening, API, or business logic.

| Component | Main props and conventions |
| --- | --- |
| `Button` | `variant`: primary, secondary, outline, ghost, danger, success; `size`: small, medium, large; `loading`, `disabled`. Defaults to `type="button"`; explicitly use submit inside forms. Native props and React 19 refs pass through. |
| `Input`, `Select` | `label`, `id`, `helperText`, `error`, `required`, native controlled/uncontrolled props; Input supports an optional `endAdornment` slot for trailing controls such as password visibility. `wrapperClassName` styles the field wrapper. Select options use `{ value, label, disabled? }`. |
| `Checkbox` | `label`, `helperText`, `error`, `checked` or `defaultChecked`, `indeterminate`, native input props. Supply `aria-label` when there is no visible label. |
| `Field` | Internal shared label/helper/error wrapper for text fields and selects. |
| `SearchInput` | Input composition with a search icon and native search input. No requests or implicit filtering. |
| `Badge` | `variant`: success, warning, danger, info, neutral; optional `dot`. |
| `StatusBadge` | `status` looks up the centralized mapping in `constants/statusTypes.js`; `variant` overrides it; children override visible text. Unknown labels use neutral styling. |
| `Card` | `title`, `description`, `actions`, `footer`, `padding`, children. Set padding false for edge-to-edge tables. |
| `PageHeader` | `title`, `description`, `eyebrow`, `breadcrumbs`, `actions`. Renders the page h1. |
| `Breadcrumbs` | `items`: `{ label, href?, id? }`. Uses React Router links; final item is current. |
| `FilterBar` | Labeled region containing caller-supplied controls, optional `onReset` and `actions`. |
| `DataTable` | `columns`: `{ key, header, align?, render?, sortable? }`; render receives value and row. `data`, unique `rowKey` field/function (default id), accessible `caption`, `loading`, empty-state copy, optional `pagination`. |
| `DataTable` sorting | Optional controlled `sort: { key, direction: "asc" or "desc" }` and `onSort(key)` enable sortable column-header buttons with `aria-sort`. The caller orders the data. Existing tables are unchanged. |
| `DataTable` selection | Supply `selectedKeys` and `onSelectionChange(keys)`. Header checkbox selects visible rows only; selection on other pages is retained. Table does not fetch, sort, filter, or paginate data itself. |
| `Pagination` | Controlled `page` (1-based), `pageSize`, `totalItems`, `onPageChange`, optional accessible `label`. Pass only the current page's rows to the table. |
| `Tabs` | `items`: `{ id, label, content, disabled? }`; controlled `value`/`onChange` or uncontrolled `defaultValue`; descriptive `label`. Arrow keys, Home/End, disabled-item skipping, and automatic activation. |
| `Dropdown` | `label`, `items`: `{ id, label, icon?, disabled?, danger?, onSelect? }`; `align`: left/right. Arrow keys, Home/End, initial-letter navigation, Escape, outside click, and focus return. |
| `Tooltip` | Short, noninteractive `content` and one focusable React element child. Supports hover, keyboard focus, Escape, and horizontal viewport clamping. Never put essential instructions only in a tooltip. |
| `Modal`, `Drawer` | Controlled `open` and `onClose`; required meaningful `title`, optional `description`, `footer`, `initialFocusRef`, `closeOnBackdrop`. Modal sizes: small, medium, large. Native dialog supplies a modal background; Tab containment, Escape, focus restoration, and body scroll locking are included. |
| `ConfirmDialog` | `open`, `onClose`, `onConfirm`, `title`, `description`, `confirmLabel`, `cancelLabel`, `variant`, `loading`. Cancel receives initial focus. Caller owns completion and closing. |
| `ProgressBar` | `value`, `max`, `label`, `status`: completed, active, pending, failed, warning; optional `showValue` and `compact` (percentage plus bar, with a screen-reader label). Visual states do not calculate workflow progress. |
| `StepIndicator` | `steps`: `{ id, label, description?, status }`, using the same five progress states; `label` names the list. Presentation only, not an orchestrator. |
| `LoadingSpinner` | Accessible `label`, small/medium `size`; use `decorative` when another element already announces loading. Respects reduced motion. |
| `EmptyState` | `title`, `description`, optional Lucide `icon` and `action`. |
| `AlertBanner` | In feedback/: `variant` info/success/warning/danger, `title`, children, `action`, `onDismiss`. Set `announce` for newly inserted messages; static examples are not live alerts. |
| `SuccessMessage`, `ErrorState` | Feedback compositions; ErrorState accepts `onRetry`. No retry operation is performed internally. |
| `Toast` | Controlled `open`, `onClose`, `title`, `variant`, children. Persistent until dismissed; no auto-dismiss timing or notification store. |

## Accessibility and preview scope

Use visible labels (or explicit accessible names), descriptive dialog titles and table captions, and text labels alongside status colors. Focus outlines are visible, modal focus is contained, disabled native controls remain disabled, and reduced-motion preferences are respected. Consumer-provided content and future screens still require their own accessibility review.

The single `DesignSystemPage` is a component catalogue split into local section components. Its fictional records, filtering, selection, form feedback, and overlay state are local demo interactions only. It neither reads nor writes browser storage, requests application data, nor connects to a service. The showcase remains separate from application screens and is shared by all three roles.


## Login screen (demo only)

Open `/login`; `/` redirects there. The component showcase at `/design-system` is unchanged. No protected routes are mounted. The Duty Officer dashboard can be opened directly, independently of this demo form.

- `pages/auth/LoginPage.jsx` composes the screen; it contains no authentication or validation logic.
- `layouts/AuthLayout.jsx` supplies the responsive 46/54 desktop layout. Below 768 px, the institutional panel becomes a compact header and the form follows in one column.
- `features/auth/components/InstitutionalPanel.jsx` uses the existing fictional emblem and a CSS checkpoint illustration. It contains no real government branding or external imagery.
- `LoginForm.jsx` owns transient form state, required-field validation, password visibility, remember-device state, and the local success message.
- `RoleSelector.jsx` uses the shared native Select and the three options in `constants/roles.js`: Admin, Surveillance Officer, Duty/Border Officer. Selecting a role grants no permissions.
- `SecurityNetworkIndicator.jsx` marks network and system-status text as demo indicators, not verified security or service-health claims.

### Try the demo

Enter a fictional ID such as `DEMO-EMPLOYEE-01`, any non-whitespace fictional password, and one of the three roles. Submit with Sign In or Enter. The page displays `Demo sign-in successful.` and the chosen role, clears the ID/password, re-hides the password, and stays on the login page. There is no real credential validation or password policy yet.

Empty or whitespace-only credentials are rejected with field-specific messages. A missing role is rejected. Focus moves to the first invalid field; errors are linked to their inputs and a summary is announced. Password visibility never submits the form. The forgot-password action opens a local assistance dialog, not a reset request.

The remember-device checkbox is local UI state only and resets on reload. The application does not save credentials, create a session/JWT, use cookies or browser storage for sign-in, make an API request, contact FastAPI, or log credential values. Use fictional values only; browser/password-manager behavior is outside this prototype's control. Auth services, stores, permission gates, and the useAuth placeholder remain unimplemented.

No new dependencies or design tokens were added for this screen. Card, Input (with an additive trailing-adornment slot), Select, Checkbox, Button, Badge, StatusBadge, AlertBanner, SuccessMessage, and Modal come from the shared design system.


## Duty / Border Officer dashboard

The Duty Officer workspace is a directly accessible, frontend-only demonstration. It does not require or create a login session. No Login source files or design tokens were changed for this workspace.

### Routes

| Route | Current behavior |
| --- | --- |
| `/duty-officer` | Redirects to `/duty-officer/dashboard` |
| `/duty-officer/dashboard` | Border Operations dashboard |
| `/duty-officer/screening` | Live Passenger Queue workspace |
| `/duty-officer/screening/queue` | Redirects to `/duty-officer/screening` |
| `/duty-officer/documents` | Local Document Capture workspace |
| `/duty-officer/screening/progress` | Controlled demo Automated Screening Progress |
| `/duty-officer/screening/result` | Data-driven demo Screening Result |
| `/duty-officer/history` | Passenger History placeholder |
| `/duty-officer/alerts` | Alerts placeholder |
| `/duty-officer/reports` | Reports placeholder |

The six navigation entries are Dashboard, Live Screening, Upload Documents, Passenger History, Alerts, and Reports. Unknown paths inside this workspace show the same minimal unavailable-page pattern. Placeholders contain explanatory text and a return button only. They do not start a screening, request a file, display results, or implement the future feature. `/login`, the root redirect to Login, and `/design-system` are preserved.

### Responsibilities

- `DutyOfficerLayout` composes the shared header, compact navigation, mobile navigation drawer, page container, and nested routes.
- `AppHeader` accepts the system name, checkpoint, officer, notifications, alerts destination, and demo flag. It shows the current checkpoint at every breakpoint. `NotificationMenu` displays the static notices in a drawer; it does not subscribe to events or manage read state.
- `DutyDashboardPage` composes the six metrics, queue, active-screening summary, recent alerts, checkpoint status, and quick actions. All fixture objects are outside the page.
- `ScreeningQueue` accepts passenger rows and provides only a local All entries / Needs attention display filter. The supplied `requiresAttention` flag is not calculated by the UI. Desktop/tablet use the shared semantic DataTable; mobile uses labeled entries with all seven fields rather than shrinking the table.
- `ActiveScreeningPanel` accepts one summary object. Progress and stages are static presentation, not a workflow engine. The shared `StepIndicator` adds an optional `orientation="vertical"` mode; its existing default behavior is unchanged.
- `RecentAlerts` and `AlertCard` render the supplied notices. `SystemHealthPanel` renders the supplied checkpoint/device states. Neither performs checks or analysis.
- `QuickActions` uses navigation configuration and shared Buttons to open the queue workspace or the Document Capture workspace. `TopNavigation` uses real router links, current-page styling, and supports vertical presentation in the mobile drawer.
- Shared `MetricCard` accepts `label`, `value`, optional `unit`, `description`, Lucide `icon`, and semantic `tone`. Values stay neutral; color is restrained to small icons. `SystemStatus` composes StatusBadge. No new palette, state library, or dependency was introduced.

### Fictional data contracts

`src/data/mockDutyDashboard.js` assembles these JSON-serializable fixtures:

| File | Fixture content |
| --- | --- |
| `mockDutyDashboard.js` | System identity, six metric values and references to the snapshot datasets |
| `mockPassengers.js` | Seven recent entries: queue number, fictional passenger label, document type, fictional nationality, current stage, risk label, status and attention flag |
| `mockScreenings.js` | Passenger A / queue #1024, Face Verification at 80%, and six automated-stage states |
| `mockAlerts.js` | Three fictional notices; exception queue references match the displayed passengers |
| `mockCheckpoints.js` | Fictional North Border Checkpoint, device/service states and queue depth |
| `mockOfficers.js` | Officer A. Demo / DEMO-BO-1047, a fictional Duty/Border Officer |

Daily metrics and the full-checkpoint workload are aggregate fixture values. The queue table is a recent-entry window including completed and referred cases, not a complete list of the seven screenings currently running across checkpoint lanes. The daily completed total is 1,284: 1,241 cleared, 31 medium-risk referrals, and 12 high-risk referrals.

All progress, risk labels, device health, notification counts and relative alert times refer to a static demo snapshot. They are not live readings, final decisions, or computed AI outputs. There are no API calls, mock API endpoints, timers, polling, WebSocket connections, permission checks, browser persistence, hardware access, or actual screening decisions. Future backend responses can replace the fixture objects without putting transport in components.

The intended operational message is explicit: software performs automated checks and refers exceptions to officers. The dashboard does not provide manual verification controls or implement an officer decision workflow.

## Live Passenger Queue

`src/pages/duty-officer/screening/LivePassengerQueuePage.jsx` composes the shared PageHeader, four compact summary counts, working queue filters, responsive entries, and a single accessible drawer. The dashboard and its fixtures remain unchanged; the workspace is a separate fictional snapshot, not synchronized live checkpoint data.

### Components and state

- `src/features/screening/hooks/usePassengerQueue.js` owns ephemeral queue entries, filters, controlled sorting, selection, and a user-triggered demo start. No transport, authentication, persistence, timers, real screening, or decisions are implemented. Reloading resets the demo.
- `QueueSummary` counts waiting, active, and review/anomaly entries across the entire queue, independent of filters. Cleared Today is a fixed aggregate of 1,241; it includes the completed demo entry and does not increment on Start Screening.
- `QueueFilters` reuses SearchInput, Select and FilterBar. Case-insensitive passenger-name or queue-number search combines with exact status, risk, document-type and stage filters. Clear Filters resets all five fields. Empty results provide the same action.
- `PassengerQueueTable` reuses DataTable on wide screens (1,280px and above). Queue number, progress, risk and status headers toggle sorting. Risk order is Pending, LOW, MEDIUM, HIGH; status order is Waiting, In Progress, Review Required, Completed, Anomaly Detected. Numeric queue order breaks ties.
- `ScreeningQueueRow` renders readable, labeled list entries on tablet/mobile rather than squeezing nine columns. `QueueEntryAction` and `QueueEntryProgress` share behavior and visual treatment between table and list.
- `PassengerQueueDrawer` shows identification labels, state, numerical progress and a compact nine-stage automated pipeline. `ReviewRequiredDrawer` supplies explicit fictional evidence and placeholder actions within that same dialog. View Result opens only a completed-entry summary, not a results page.
- Shared Button, Badge, StatusBadge, Card, EmptyState, ProgressBar, StepIndicator, Drawer and AlertBanner preserve the approved tokens and styling. DataTable sorting and ProgressBar compact mode are opt-in additions. The shared modal body is keyboard-focusable so long drawer content can be scrolled without a pointer.

### Fictional fixtures and interactions

`src/data/mockPassengerQueue.js` supplies ten JSON-serializable entries, a fictional North Border Checkpoint context, explicit pipeline states, and review evidence. Initial counts are 3 waiting, 3 screening and 3 requiring attention (2 review referrals plus 1 anomaly); 1 entry is completed. Names are Passenger A-J and countries are Country A-J. Queue numbers are queue references, not identity or document numbers. All five document labels are centralized in `src/constants/documentTypes.js`; queue stage/status/risk options live in `src/features/screening/constants/queueOptions.js`.

Start Screening changes only a waiting entry to In Progress / Document Detection / 5%, activates the first pipeline marker, updates counts, and announces the local change. It performs no actual analysis. Review referrals show completed automated analysis with an unresolved officer decision; an anomaly can stop before risk assessment completes. Preliminary LOW labels on in-progress entries are not clearance decisions. Evidence is supplied by fixtures, never generated by the UI.

Review placeholder actions explain that full results and officer review are not implemented, and never record a decision or clear a passenger. Start New Screening opens the `/duty-officer/documents` capture workspace. The existing navigation already points Live Screening to the new route; the legacy `/duty-officer/screening/queue` alias redirects there so dashboard quick actions keep working.

### Verification

The Vite-served queue was tested in headless Chrome at 320, 390, 768, 820, 1,024, 1,280 and 1,440px. Checks cover filters/search, empty/reset state, sorting, local start/count updates, detail/review/summary drawers, keyboard focus trapping and return, native select interaction, mobile entries, the document placeholder, the legacy alias, and Login/dashboard routes. Automated accessibility audits cover desktop/mobile queue and detail/review drawers. Verification helpers and screenshots are local ignored cache artifacts, not application dependencies.


## Document Capture

Open `/duty-officer/documents` directly or use Upload Documents in the existing Duty Officer navigation. The queue's Start New Screening action and dashboard Upload Documents action already point here. `/duty-officer/screening/progress` opens the separate fictional demo pipeline; `/duty-officer/screening/result` displays independent fictional result scenarios.

### Files and responsibilities

| File under `src/` | Responsibility |
| --- | --- |
| `pages/duty-officer/documents/DocumentUploadPage.jsx` | Composes the existing layout, passenger context, capture workflow and demo navigation |
| `data/mockDocumentCapture.js` | Fictional Passenger F / Country F / queue #1029 at North Border Checkpoint |
| `features/document-screening/hooks/useDocumentUpload.js` | Local files, selection, add/replace/remove, per-page labels, confirmation, validation and preview-URL cleanup |
| `features/document-screening/constants/captureOptions.js` | Six document choices, page instructions, accepted formats, limits and unassessed quality labels |
| `features/document-screening/utils/documentFiles.js` | Local file checks, size formatting and generation of a clearly fictional PNG sample |
| `features/document-screening/components/DocumentTypeSelector.jsx` | Type and page-side controls for newly added files |
| `features/document-screening/components/DocumentCapture.jsx` | Capture controls, local feedback and demo-camera dialog composition |
| `features/document-screening/components/FileUpload.jsx` | Accessible shared-Button trigger for a real browser file input |
| `features/document-screening/components/CameraCapture.jsx` | Explicit demo fallback, Capture Document, Cancel and error handling; no hardware access |
| `features/document-screening/components/DocumentPreview.jsx` | Image preview or PDF attachment notice, filename, MIME/size, timestamp, source, page label, replace and remove |
| `features/document-screening/components/DocumentList.jsx` | Multiple document/page entries, selected preview and Add Another Document / Page |
| `features/document-screening/components/DocumentCaptureInstructions.jsx` | Compact operational capture guidelines |
| `features/document-screening/components/CaptureQuality.jsx` | Honest preliminary file-readiness display; visual quality remains Not assessed |
| `features/document-screening/components/ScreeningReadySummary.jsx` | Count/type summary, document confirmation, validation feedback and Start Automated Screening |
| `routes/dutyOfficerRoutes.jsx` | Capture route and minimal progress placeholder |

The approved design system, Login, Duty Officer shell/dashboard, Live Passenger Queue and their data are unchanged. Capture-specific options extend the shared five document types with Other Travel Document without changing the queue's filters. Reused primitives include Card, PageHeader, Button, Select, Checkbox, Badge, Modal, EmptyState, LoadingSpinner and AlertBanner. No dependencies are added.

### File handling and validation

- File selection is real, but there is no server upload. JPG/JPEG, PNG and PDF are accepted, up to 10 MB (10 MiB) each and ten documents per demo screening. Empty files are rejected.
- Extension, supplied MIME type and basic file signatures must agree. Images must also decode successfully in the browser. These are convenience checks, not antivirus, PDF validation, document authentication, or AI analysis. Future servers must validate independently.
- A multi-file selection is accepted as a batch only if every selected file passes validation. Failed additions/replacements leave existing documents intact. Replacements retain the original document type and page label. Selecting another type only affects future additions; individual page labels are editable in the preview.
- JPEG/PNG previews use temporary object URLs. PDF files show their metadata and an explicit no-inline-preview notice; they are not embedded or executed. Officers should inspect the original fictional PDF before confirming.
- Replaced/removed preview URLs are revoked, and all remaining URLs are revoked on page unmount. Files and metadata exist only in component state: no API requests, browser storage, cookies, logs of file contents, or database writes. Leaving the page or reloading discards this preparation, including when navigating to the independent demo progress screen.
- Adding, replacing, removing, or relabeling a document resets confirmation. Starting requires at least one document plus the explicit reviewed-documents checkbox. Successful submission navigates only; no real analysis starts. The progress screen runs a separate fictional sequence only after Run Demo Screening is selected.

### Camera and quality boundaries

Camera mode is intentionally a demo, consistent with the no-real-hardware scope. It never calls `getUserMedia`, requests permissions, displays a live feed or reads a scanner. Capture Document generates a local black-and-white PNG marked FICTIONAL / DEMO ONLY / NOT A VALID DOCUMENT, without official emblems, document numbers or biometric images. Cancel (including during sample decoding) adds nothing. If sample creation fails, the dialog explains that file upload remains available. Future hardware integration can replace this isolated component.

Capture Quality reports only that attached files meet format/size limits. Image clarity, complete-document visibility, glare and edges explicitly remain Not assessed. No simulated Good/Passed visual-analysis results are presented. Ready for screening means prepared files, not verified identity or document validity.

### Verification

Vite-served headless Chrome checks cover all document choices/instructions, JPG/JPEG/PNG/PDF selection, previews and metadata, unsupported/oversized/empty/disguised/corrupt files, batch validation, multiple pages, replacement/removal, confirmation reset, camera fallback/sample/cancel, keyboard focus, the progress route and existing routes. Responsive views are checked from 320px through 1,440px. Automated accessibility checks cover empty/populated capture pages, mobile layout and the camera dialog. Browser instrumentation verifies object-URL cleanup, no hardware requests, no outgoing upload requests, and no application storage. Test tools/screenshots remain in ignored local cache, not the application dependency manifest.


## Automated Screening Progress

Open `/duty-officer/screening/progress` directly or through Document Capture. All stages initially wait; select Run Demo Screening to begin one finite fictional sequence. There is no automatic run on route entry and no actual AI analysis.

### Files and responsibilities

| File under `src/` | Responsibility |
| --- | --- |
| `pages/duty-officer/screening/ScreeningProgressPage.jsx` | Composes the progress screen and selects the matching demo result scenario |
| `features/screening/constants/screeningSteps.js` | Single ordered definition of the nine stages: id, label, description, order and optional short queue label |
| `features/screening/constants/queueOptions.js` | Derives queue stages from the shared definition, preserving existing queue labels/order |
| `data/mockScreeningProgress.js` | Fictional context, document summaries, initial state, scenario outcomes, sub-checks, event clock and system status |
| `features/screening/hooks/useScreeningProgress.js` | Isolated reducer and cancellable timer; stage states, progress, warnings, failures, events and pending-risk presentation |
| `features/screening/components/ScreeningPipeline.jsx` | Shared vertical StepIndicator with completed/active/pending/warning/failed states |
| `features/screening/components/ScreeningProgressHeader.jsx` | Status, horizontal progress, context, Run/Reset/scenario controls, live announcements and result action |
| `features/screening/components/CurrentAnalysisPanel.jsx` | Stage descriptions and explicit demo sub-check states, including the six tampering sub-checks |
| `features/screening/components/ScreeningActivity.jsx` | Latest six events in chronological order with illustrative timestamps |
| `features/screening/components/ScreeningDocumentSummary.jsx` | Independent fictional documents; no captured files or unavailable previews |
| `features/screening/components/ScreeningSystemStatus.jsx` | Four illustrative service indicators, not actual health checks |
| `components/data-display/ActivityFeed.jsx` | Generic presentation of `items: { id, time, title, description?, variant? }[]`, with list label and empty message |
| `routes/dutyOfficerRoutes.jsx` | Registers the implemented progress and result screens |
| `features/document-screening/components/ScreeningReadySummary.jsx` | Helper-text correction only: the destination now uses independent fictional screening data |

Card, PageHeader, Badge, StatusBadge, ProgressBar, StepIndicator, AlertBanner, Button and Select are reused unchanged. ActivityFeed was an unused placeholder and is now generic. Login, dashboard, Duty Officer layout, queue appearance/behavior, Document Capture workflow and the approved palette are preserved. No dependencies are added.

### Demo behavior

The single stage definition contains Document Detection; OCR / Text Extraction; Structure Analysis; Document Validation; Tampering Analysis; MRZ Validation; Face Extraction; Face Verification; Risk Assessment. The queue retains its short OCR label through the same definition.

- Run Demo Screening starts a fresh selected scenario. A single cancellable timeout advances one stage approximately every 1.2 seconds; standard completion takes about 10.8 seconds. There is no interval or endless replay.
- Standard completion finishes all nine stages. Progress measures stages completed or finished with a warning, not elapsed time or an AI metric.
- The warning scenario marks Tampering Analysis with Potential document inconsistency detected, continues, and retains unresolved officer-review messaging at 100%. It never classifies anyone as fraudulent or cleared.
- The failure scenario stops at MRZ Validation with MRZ data could not be validated. Five stages have finished, progress stays at 56%, and face checks/risk assessment remain pending. No result action is available.
- Risk stays Pending until Risk Assessment completes. Afterwards the page says Assessment complete - view result. No numeric score, final risk classification, or clearance decision is calculated or displayed.
- Reset cancels pending advances and clears local events/outcomes. Scenario changes reset the demo and are disabled during a run. Rerun starts fresh. Timeouts are cleaned up on stage changes, reset and navigation/unmount.
- View Screening Result appears only after completion and opens `/duty-officer/screening/result`: standard completion selects LOW and warning completion selects MEDIUM.

### Boundaries and accessibility

The Passport identity page and Visa / Travel Authorization page are explicitly fictional fixtures, not the files selected on Document Capture. Capture files still disappear on departure. Sub-checks, warnings, failures, service indicators and event times are demo presentation data, not actual AI outputs or live readings. Replace the isolated progress hook with backend-driven state later; no APIs, WebSockets, authentication, browser persistence or AI libraries are present.

Pipeline states have visible text and icons, not color alone. The pipeline remains vertical at every width. A polite atomic live region announces stage/progress changes; warning/failure banners use appropriate status/alert roles. Controls retain visible focus, native select keyboard support and disabled states. The activity feed is not another live region, avoiding duplicate announcements.

### Verification

Vite-served Chrome checks cover all nine transitions/progress values, tampering sub-checks, risk availability, standard completion, retained warnings, failure stopping, reset/rerun, chronological events, result navigation, capture-to-progress navigation and existing routes. Instrumentation verifies at most one active demo timer, no timer after completion/failure/reset/unmount, no browser storage or outgoing backend requests. Layouts were checked at 320, 390, 768, 820, 1,024, 1,280 and 1,440px. Automated accessibility audits cover ready, complete, warning, failure and mobile states. Test helpers/screenshots remain in ignored local cache.


## Screening Result

Open `/duty-officer/screening/result`. One data-driven page supports LOW (18/100, CLEAR), MEDIUM (54/100, OFFICER REVIEW REQUIRED), and HIGH (82/100, OFFICER REVIEW REQUIRED). The secondary Demo Scenario selector changes the entire result, not just its score. A fresh direct entry defaults to LOW. Completed standard/warning progress runs select LOW/MEDIUM through a validated scenario id in router history state. The progress failure scenario still cannot open a result. HIGH is a standalone completed-assessment fixture with recorded failed checks, not the outcome of the stopped progress demo.

### Files and components

| File under `src/` | Responsibility |
| --- | --- |
| `pages/duty-officer/screening/ScreeningResultPage.jsx` | Single responsive result composition for all three scenarios |
| `data/mockScreeningResults.js` | Central fictional identity, scores, decisions, check findings, face values, identity intelligence, additive factors, explanations, recommendations and timelines |
| `features/screening/hooks/useScreeningResult.js` | Local reducer for scenario, clearance confirmation, clearance state, details/review drawer and review acknowledgement |
| `features/screening/components/DemoScenarioSelector.jsx` | Labeled native scenario control using shared Select |
| `features/screening/components/ScreeningResultHeader.jsx` | Completed-assessment summary, risk/decision, checkpoint/queue/passenger context and demo disclosure |
| `features/screening/components/IdentitySummary.jsx` | Clearly fictional identity fields and DEMO-prefixed document identifier |
| `features/screening/components/ResultEvidenceSection.jsx` | Reused check-section renderer for document validation, tampering, MRZ and identity intelligence; avoids four duplicate implementations |
| `features/screening/components/FaceVerificationCard.jsx` | Two neutral Lucide placeholders, supplied similarity and status; no actual face images |
| `features/screening/components/ResultRiskAssessment.jsx` | Risk summary and Why this result explanation |
| `features/screening/components/RiskFactorList.jsx` | Authored factor contributions and total; one reusable component in responsive desktop/mobile slots |
| `features/screening/components/OfficerDecisionActions.jsx` | Recommendation, clearance confirmation, local decision feedback and review/details triggers |
| `features/screening/components/ScreeningResultDrawer.jsx` | Accessible details or review panel, including neutral reasons and local acknowledgement |
| `features/screening/components/ScreeningTimeline.jsx` | Chronological fictional events using shared ActivityFeed |
| `components/data-display/RiskScorePanel.jsx` | Former placeholder implemented as shared textual score/maximum/level presentation |
| `routes/dutyOfficerRoutes.jsx` | Replaces the result placeholder; no new role interfaces |
| `pages/duty-officer/screening/ScreeningProgressPage.jsx` | Minimal result-navigation context: standard to LOW, warning to MEDIUM |
| `features/screening/components/CurrentAnalysisPanel.jsx` | Helper-copy correction: View Screening Result now opens the demo summary |

The approved palette, typography and generic UI controls are unchanged. Card, PageHeader, Select, Badge, StatusBadge, Button, ConfirmDialog, Drawer and ActivityFeed are reused. Login, dashboard, queue, capture workflow and progress timing/logic remain unchanged. No dependencies are added.

### Evidence and risk consistency

- LOW has passed document/tampering/MRZ checks, 98.4% MATCH, no identity associations/warnings and an illustrative +18 context contribution. CLEAR is the supplied system decision; the local officer clearance is a separate explicit confirmation.
- MEDIUM has a document-field warning, font warning, 71.2% REVIEW REQUIRED and two fictional previous associations. Factors are +18, +14, +12 and +10, totaling 54.
- HIGH includes MRZ failure, document-field and font/photo/stamp warnings, 61.8% MISMATCH and potential duplicate-identity context. Factors are +28, +24, +18 and +12, totaling 82. Its timeline records the MRZ failure rather than falsely showing that check as passed.
- Scores and classifications are authored fixture values, not calculated thresholds or ML outputs. Verification checks that factor totals match the supplied scores. Association history is described as context, not proof of wrongdoing. Recommendations never automatically reject a passenger.
- All dates, names, document identifiers, associations, timestamps and percentages are fictional. The two portrait panels use neutral line-icon placeholders with accessible descriptions; they contain no real face or biometric image. A prominent demo disclosure explains that no document, biometric or database analysis occurred.

### Officer actions and lifecycle

Clear Passenger is available only for LOW and opens Confirm Passenger Clearance with Cancel and Confirm Clearance. Cancel changes nothing. Confirmation shows Passenger cleared with explicit demo-only/no-database-persistence wording, disables repeat clearance and moves focus to the confirmation feedback.

Review Case is available for MEDIUM/HIGH and opens neutral evidence/recommendation context. Acknowledge Demo Review updates local review state only; the system decision remains OFFICER REVIEW REQUIRED and no passenger is cleared. View Details works for all scenarios and shows a fictional record/evidence summary. Drawers return focus to their triggers and trap keyboard focus while open.

Changing to a different scenario resets clearance, review state and dialogs. Leaving/reloading resets officer actions. Router history may retain the initial demo-scenario id from progress navigation, but never a clearance decision or document data. No API requests, database writes, browser-storage decision persistence, JWTs, authentication or AI libraries are present.

### Responsive layout and verification

Desktop uses an evidence column and a narrower risk/recommendation/action sidebar. Mobile puts result, risk, recommendation and actions before identity/evidence, with factors followed by the timeline at the bottom. Only one responsive factor panel is visible/accessibility-exposed at a time; each has its own generated heading id.

Chrome checks cover all three scores, exact factor totals, changing evidence/face/identity states, recommendations, MRZ failure, timeline order, clearance cancel/confirm, review acknowledgement, details, scenario isolation, progress-to-result routing and existing screen routes. Layouts were checked at 320, 390, 768, 820, 1,024, 1,280 and 1,440px. Keyboard focus/return/trapping and automated accessibility audits cover all scenarios, dialogs, clearance feedback and mobile states. Tests also check that no real images, outgoing backend requests or decision storage are used. Verification helpers/screenshots remain in ignored local cache.

## Passenger Detail / Screening History

Open `/duty-officer/passengers/PAX-DEMO-1029` for the fictional Passenger F case. The route `/duty-officer/passengers/:passengerId` is implemented; unknown IDs show a not-found state instead of another passenger's records. Direct access defaults to HIGH. No standalone Passenger History list, Admin or Surveillance screen is added.


### Files and reuse

Paths below are relative to src/ unless stated otherwise.

| File | Change |
| --- | --- |
| pages/duty-officer/passengers/PassengerDetailPage.jsx | Replaces the placeholder with one scenario-driven case page and unknown-ID handling |
| features/passengers/hooks/usePassengerDetails.js | Local scenario, review, acknowledgement, decision and confirmation state |
| data/mockPassengerDetails.js | Shared passenger/result references, previous screenings, document history, alerts, officer decisions and chronological latest audit |
| data/mockScreeningResults.js | Adds canonical fictional passenger ID and document issue date; no result values change |
| features/passengers/components/PassengerScreeningSummary.jsx | Current risk, system status, checkpoint, passenger, queue and completion timestamp |
| features/passengers/components/PassengerIdentityCard.jsx | Implements the identity-information placeholder |
| features/passengers/components/CurrentDocumentCard.jsx | Neutral document placeholder with demo validity, expiry and MRZ summary |
| features/passengers/components/PassengerHistoryTables.jsx | ScreeningHistoryTable, DocumentHistoryTable, PassengerAlertHistory and OfficerDecisionHistory; shared table composition and controlled sorting |
| features/passengers/components/PassengerAuditTrail.jsx | Latest screening lifecycle through shared ActivityFeed |
| features/passengers/components/PassengerActionBar.jsx | Recommendation, navigation, confirmation and local decision feedback |
| features/passengers/components/PassengerReviewDrawer.jsx | Existing drawer pattern with risk, factors, evidence and acknowledge/clear/refer actions |
| routes/dutyOfficerRoutes.jsx | Registers passengers/:passengerId without removing existing routes |
| features/screening/components/ScreeningResultDrawer.jsx | Adds Open Passenger Detail while preserving the existing details/review drawer |
| features/screening/components/PassengerQueueDrawer.jsx | Adds Open Passenger Detail when the queue record has a supported passenger ID |
| data/mockPassengerQueue.js | Adds canonical passengerId metadata to Passenger F only; no queue values or behavior change |
| config/navigation.js | Associates passenger case routes with the existing Passenger History navigation item |
| components/layout/TopNavigation.jsx | Supports active path aliases with aria-current while retaining navigation destinations |
| ../README.md | Documents case fixtures, navigation, local actions and verification |

Reuses Card, DataTable, StatusBadge, Badge, PageHeader, Button, Drawer, ConfirmDialog, AlertBanner, EmptyState, ActivityFeed and RiskScorePanel. ResultEvidenceSection, RiskFactorList and DemoScenarioSelector are shared with Screening Result. No palette, typography, shared form styles, dependencies or technologies are added.

### Fixtures and consistency

- LOW / MEDIUM / HIGH use the existing 18 / 54 / 82 result values, evidence, recommendations and passenger object, not three copies of the case page. HIGH retains the established MRZ failure and face mismatch; MEDIUM retains the font/field warnings and face-review state. No AI or database work is performed.
- Latest-screening status aggregates supplied check statuses for display, never calculates risk. The case overview, current document, current history row, current alerts and audit events follow the selected scenario. The risk factors and recommendations come directly from the result fixture.
- Two previous screenings and human decisions remain historical snapshots when the demo scenario changes. The document history uses an expired historical document with an actual past expiry (2026-04-18), not a future-dated document incorrectly labeled expired. The current document identifier matches the identity summary.
- Identity-intelligence association signals describe the current fictional reference-match scenario, not the number of document-history rows. They do not represent a connection to any real government database.
- The audit supplements the existing result timeline with detection, structure, tampering-start/warning, face-extraction, identity and final recommendation events in chronological order. Existing result event timestamps are preserved. Failure/warning evidence is not mislabeled as passed.
- Passenger F is the only complete case fixture. Queue F's earlier waiting/permit snapshot is intentionally unchanged; its drawer explains that the linked completed passport case is a separate demo snapshot. Queue numbers and names are not used as identity keys. Other queue entries do not link to Passenger F.

### Navigation and officer actions

Screening Result -> View Details -> Open Passenger Detail carries the selected demo scenario. The existing result drawer is preserved. View Latest Screening from the case opens the corresponding result scenario. Queue F -> Start Screening -> View -> Open Passenger Detail opens the HIGH case fixture. Passenger History remains its existing placeholder destination; the breadcrumb and navigation do not build that separate screen. View Screening History scrolls to and focuses this case's history section.

LOW offers Clear Passenger. MEDIUM/HIGH offer Review Case with risk summary, neutral evidence, factors and recommendation. Acknowledge changes local state without a decision. Clearance always requires Confirm Passenger Clearance, defaults focus to Cancel and warns about unresolved signals for elevated-risk cases. Refer for Further Review sets a local referral. Neither clearance nor referral changes the original automated risk, historical rows, alerts or audit snapshots; this distinction is stated in the UI. Decisions are terminal for the current visit/scenario to prevent accidental overwrites.

The hook resets acknowledgement/decision/dialog state on scenario changes and when leaving or reloading the case. Router navigation carries only a demo-scenario hint; it does not persist decisions, credentials, uploaded documents or biometric data. No fetch calls, backend requests, storage writes or new services are added.

### Verification

- Vite starts and the case route renders without import or browser-console errors.
- Chrome checks cover all three scenarios, identity/document/evidence consistency, histories, alerts, previous decisions, chronological audit, risk/date sorting and aria-sort, history focus navigation, acknowledgement, clearance cancel/confirm and referral.
- Keyboard checks cover skip navigation, native scenario selection, drawer focus trapping/return, Escape, nested clearance confirmation and post-decision feedback focus. All status badges also have text; the document visual is an accessible non-photographic placeholder.
- Responsive checks cover 320, 390, 640, 768, 820, 1024, 1280 and 1440px. There is no page-level horizontal overflow; tables have named, focusable horizontal scroll regions. Desktop/tablet/mobile screenshots are inspected, including a narrow table and nested confirmation dialog.
- Automated axe WCAG 2 A/AA, 2.1 AA and 2.2 AA checks report zero violations for all scenarios, review/confirmation states, mobile and unknown-ID states. Automated checks supplement keyboard/visual checks and are not a certification of complete accessibility.
- Existing Login, Dashboard, Queue, Document Capture, Screening Progress and Screening Result browser regression suites pass. No backend requests or browser decision storage are observed. Verification helpers and screenshots remain in ignored local cache.
- ESLint and the production build pass. No dependencies are added. Completed screens are untouched except the explicit queue/result navigation integration; the shared navigation gains only active-path support.
