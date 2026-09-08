import { useState } from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Database,
  FileText,
  Fingerprint,
  LayoutDashboard,
  MapPin,
  Monitor,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  TriangleAlert,
  User,
  Users,
  X,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Drawer from '../components/ui/Drawer';
import Tabs from '../components/ui/Tabs';
import Tooltip from '../components/ui/Tooltip';
import Dropdown from '../components/ui/Dropdown';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import FilterBar from '../components/ui/FilterBar';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProgressBar from '../components/ui/ProgressBar';
import StepIndicator from '../components/ui/StepIndicator';
import DataTable from '../components/ui/DataTable';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AlertBanner from '../components/feedback/AlertBanner';
import ErrorState from '../components/feedback/ErrorState';
import SuccessMessage from '../components/feedback/SuccessMessage';
import Toast from '../components/feedback/Toast';

const sections = [
  ['foundations', 'Foundations'],
  ['controls', 'Buttons & forms'],
  ['status', 'Status & feedback'],
  ['progress', 'Progress & navigation'],
  ['tables', 'Tables'],
  ['overlays', 'Overlays & states'],
];

function ShowcaseSection({ id, number, title, description, children }) {
  return (
    <section id={id} aria-labelledby={id + '-title'} className="scroll-mt-6 space-y-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-caption font-semibold tabular-nums text-muted">{number}</span>
        <div>
          <h2 id={id + '-title'} className="text-section font-semibold text-navy">
            {title}
          </h2>
          <p className="mt-1 text-body text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FoundationsPreview() {
  const colors = [
    ['Government blue', 'bg-primary', 'Primary'],
    ['Deep navy', 'bg-navy', 'Headings'],
    ['White', 'bg-surface', 'Surfaces'],
    ['Off-white', 'bg-canvas', 'Canvas'],
    ['Light gray', 'bg-subtle', 'Structure'],
    ['Medium gray', 'bg-control', 'Controls'],
    ['Dark gray', 'bg-ink', 'Body text'],
  ];
  const icons = [
    Shield,
    FileText,
    User,
    Search,
    TriangleAlert,
    Check,
    X,
    Camera,
    Fingerprint,
    Database,
    MapPin,
    Users,
    Settings,
    FileText,
    LayoutDashboard,
    Monitor,
  ];
  return (
    <ShowcaseSection
      id="foundations"
      number="01"
      title="Foundations"
      description="A neutral working environment. Color carries meaning, not decoration."
    >
      <Card title="Core palette" description="One shared visual language across all three roles.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {colors.map(([name, color, purpose]) => (
            <div key={name}>
              <div className={'mb-3 h-12 rounded-control border border-default ' + color} />
              <p className="text-caption font-semibold">{name}</p>
              <p className="text-caption text-muted">{purpose}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-default pt-4">
          <span className="text-caption text-muted">Semantic accents</span>
          {['success', 'warning', 'danger', 'info', 'neutral'].map((variant) => (
            <Badge key={variant} variant={variant} dot>
              {variant}
            </Badge>
          ))}
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Typography"
          description="System sans-serif. Clear hierarchy. No oversized headings."
        >
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-page font-semibold text-navy">Page title</dt>
              <dd className="text-caption text-muted">28 / 35 &middot; Semibold</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-section font-semibold text-navy">Section title</dt>
              <dd className="text-caption text-muted">18 / 27 &middot; Semibold</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-card font-semibold">Card title</dt>
              <dd className="text-caption text-muted">16 / 24 &middot; Semibold</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Body & table content</dt>
              <dd className="text-caption text-muted">14 / 22 &middot; Regular</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Secondary text</dt>
              <dd className="text-caption text-muted">14 / 22 &middot; Regular</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-body font-semibold">Form labels</dt>
              <dd className="text-caption text-muted">14 / 22 &middot; Semibold</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-caption font-semibold text-muted">Table headers</dt>
              <dd className="text-caption text-muted">12 / 18 &middot; Semibold</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-caption text-muted">Caption & metadata</dt>
              <dd className="text-caption text-muted">12 / 18 &middot; Regular</dd>
            </div>
          </dl>
        </Card>
        <div className="space-y-5">
          <Card title="Spacing & surfaces">
            <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-body">
              <dt className="text-muted">Page padding</dt>
              <dd>16 mobile / 32 desktop</dd>
              <dt className="text-muted">Card padding</dt>
              <dd>20 px</dd>
              <dt className="text-muted">Form & content gaps</dt>
              <dd>16&ndash;24 px</dd>
              <dt className="text-muted">Section spacing</dt>
              <dd>40 px</dd>
              <dt className="text-muted">Table cells</dt>
              <dd>12 &times; 16 px</dd>
              <dt className="text-muted">Corner radius</dt>
              <dd>4 px controls / 6 px cards</dd>
            </dl>
          </Card>
          <Card
            title="Functional iconography"
            description="Lucide line icons &middot; 16, 20 and 24 px &middot; 1.75 stroke"
          >
            <div className="flex flex-wrap gap-4 text-muted">
              {icons.map((Icon, index) => (
                <Icon key={index} className="icon-md" aria-hidden="true" />
              ))}
            </div>
            <p className="mt-4 text-caption text-muted">
              Pair icons with labels. Icon-only actions must have an accessible name.
            </p>
          </Card>
        </div>
      </div>
    </ShowcaseSection>
  );
}

function ControlsPreview() {
  const [lastAction, setLastAction] = useState('No button selected.');
  const [formMessage, setFormMessage] = useState('Required fields are marked with an asterisk.');
  return (
    <ShowcaseSection
      id="controls"
      number="02"
      title="Buttons & form controls"
      description="Predictable actions and readable forms, with distinct focus, validation and disabled states."
    >
      <Card title="Buttons">
        <div className="flex flex-wrap gap-3">
          {['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'].map((variant) => (
            <Button
              key={variant}
              variant={variant}
              onClick={() => setLastAction(variant + ' button selected.')}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-default pt-5">
          <Button
            size="small"
            variant="outline"
            onClick={() => setLastAction('Small button selected.')}
          >
            Small
          </Button>
          <Button variant="outline" onClick={() => setLastAction('Medium button selected.')}>
            Medium
          </Button>
          <Button
            size="large"
            variant="outline"
            onClick={() => setLastAction('Large button selected.')}
          >
            Large
          </Button>
          <Button onClick={() => setLastAction('Continue selected.')}>
            Continue
            <ArrowRight aria-hidden="true" className="icon-sm" />
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading>Processing</Button>
          <Tooltip content="Helpful context on hover or keyboard focus.">
            <Button variant="ghost" aria-label="More information">
              <MoreHorizontal aria-hidden="true" className="icon-md" />
            </Button>
          </Tooltip>
        </div>
        <p className="mt-4 text-caption text-muted" role="status">
          {lastAction}
        </p>
      </Card>
      <Card
        title="Form fields"
        description="Native controls with consistent labels, guidance and validation."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setFormMessage('Demo form validated locally. Nothing was sent or saved.');
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Reference label"
              name="reference"
              required
              placeholder="e.g. Sample reference"
              helperText="Use a fictional label for this preview."
            />
            <Select
              label="Category"
              name="category"
              defaultValue="general"
              options={[
                { value: 'general', label: 'General' },
                { value: 'archive', label: 'Archive' },
                { value: 'restricted', label: 'Unavailable option', disabled: true },
              ]}
              helperText="A standard native select control."
            />
            <SearchInput helperText="Search appearance only in this example." />
            <Input
              label="Invalid reference"
              defaultValue="?"
              error="Enter a reference with at least three characters."
            />
            <Select
              label="Required selection"
              defaultValue=""
              placeholder="Choose an option"
              options={[{ value: 'sample', label: 'Sample option' }]}
              error="A selection is required."
            />
            <Input
              label="Read-only reference"
              value="DEMO-REFERENCE"
              readOnly
              helperText="Readable and selectable, but not editable."
            />
            <Input label="Disabled field" defaultValue="Not available" disabled />
            <Select
              label="Disabled selection"
              disabled
              defaultValue="none"
              options={[{ value: 'none', label: 'Not available' }]}
            />
          </div>
          <fieldset className="space-y-3 border-t border-default pt-4">
            <legend className="pr-3 text-body font-semibold">Checkbox states</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Checkbox
                label="Enable sample option"
                defaultChecked
                helperText="This setting affects this preview only."
              />
              <Checkbox label="Optional preference" />
              <Checkbox label="Unavailable preference" disabled />
              <Checkbox
                label="Required acknowledgement"
                error="Please acknowledge before continuing."
              />
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit">Validate demo form</Button>
            <p role="status" className="text-caption text-muted">
              {formMessage}
            </p>
          </div>
        </form>
      </Card>
    </ShowcaseSection>
  );
}

function StatusPreview() {
  return (
    <ShowcaseSection
      id="status"
      number="03"
      title="Status & feedback"
      description="Restrained semantic accents. Every state includes a readable label, not color alone."
    >
      <Card title="Badges & status labels">
        <div className="flex flex-wrap gap-2">
          <Badge>Default badge</Badge>
          <Badge variant="info">Information</Badge>
          <Badge variant="warning">Review required</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-default pt-4">
          {[
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL',
            'CLEARED',
            'PENDING',
            'IN PROGRESS',
            'FAILED',
            'ONLINE',
            'OFFLINE',
            'ACTIVE',
            'INACTIVE',
          ].map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertBanner title="Information" variant="info">
          This is a component preview. No live systems are connected.
        </AlertBanner>
        <SuccessMessage title="Example completed">
          The sample action is complete. No data was saved.
        </SuccessMessage>
        <AlertBanner title="Review recommended" variant="warning">
          Check the sample details before continuing.
        </AlertBanner>
        <AlertBanner title="Example could not be completed" variant="danger">
          Review the highlighted fields and try again.
        </AlertBanner>
      </div>
    </ShowcaseSection>
  );
}

function ProgressPreview() {
  const [page, setPage] = useState(1);
  return (
    <ShowcaseSection
      id="progress"
      number="04"
      title="Progress & navigation"
      description="Reusable progress states and predictable navigation&mdash;not a screening workflow."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Progress bars">
          <div className="space-y-5">
            {[
              ['completed', 100],
              ['active', 64],
              ['pending', 0],
              ['failed', 38],
              ['warning', 72],
            ].map(([status, value]) => (
              <ProgressBar key={status} label={'Sample ' + status} status={status} value={value} />
            ))}
          </div>
        </Card>
        <Card title="Tabs" description="Use the arrow keys, Home or End while a tab is focused.">
          <Tabs
            label="Example content sections"
            items={[
              {
                id: 'overview',
                label: 'Overview',
                content: (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-navy">A clear content hierarchy</h4>
                    <p className="text-muted">
                      Tabs separate related content without creating a new page. This panel contains
                      only sample copy.
                    </p>
                    <Badge variant="info">Overview panel</Badge>
                  </div>
                ),
              },
              {
                id: 'details',
                label: 'Details',
                content: (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-navy">Sample details</h4>
                    <p className="text-muted">
                      Panel focus and selection are managed by the shared Tabs component.
                    </p>
                    <Badge>Details panel</Badge>
                  </div>
                ),
              },
              { id: 'disabled', label: 'Unavailable', disabled: true, content: null },
            ]}
          />
        </Card>
      </div>
      <Card title="Step indicators">
        <StepIndicator
          steps={[
            { id: 'one', label: 'Completed step', status: 'completed' },
            { id: 'two', label: 'Current step', status: 'active' },
            { id: 'three', label: 'Pending step', status: 'pending' },
            { id: 'four', label: 'Failed step', status: 'failed' },
            { id: 'five', label: 'Review step', status: 'warning' },
          ]}
        />
      </Card>
      <Card title="Pagination">
        <Pagination
          page={page}
          pageSize={10}
          totalItems={128}
          onPageChange={setPage}
          label="Standalone pagination example"
        />
      </Card>
    </ShowcaseSection>
  );
}

const demoRecords = Array.from({ length: 12 }, (_, index) => ({
  id: 'DEMO-' + String(index + 1).padStart(2, '0'),
  label: 'Sample record ' + String(index + 1).padStart(2, '0'),
  category: index % 2 ? 'Reference material' : 'Sample document',
  status: ['VALID', 'REVIEW', 'PENDING', 'FAILED'][index % 4],
}));

function TablesPreview() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState(['DEMO-01']);
  const [message, setMessage] = useState('All records are fictional component examples.');
  const filtered = demoRecords.filter(
    (row) =>
      (row.label + row.id).toLowerCase().includes(query.toLowerCase()) &&
      (status === 'all' || row.status === status),
  );
  const columns = [
    {
      key: 'id',
      header: 'Reference',
      render: (value) => <span className="font-medium whitespace-nowrap text-navy">{value}</span>,
    },
    {
      key: 'label',
      header: 'Label',
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (value) => <span className="whitespace-nowrap text-muted">{value}</span>,
    },
    { key: 'status', header: 'Status', render: (value) => <StatusBadge status={value} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (_, row) => (
        <Button
          size="small"
          variant="ghost"
          aria-label={'Inspect ' + row.id}
          onClick={() =>
            setMessage(row.id + ' selected for inspection. No record screen is implemented.')
          }
        >
          Inspect
        </Button>
      ),
    },
  ];
  return (
    <ShowcaseSection
      id="tables"
      number="05"
      title="Tables & filters"
      description="Compact rows, clear column hierarchy and quiet selection. All data below is fictional."
    >
      <Card
        title="Sample records"
        description="Search, filter, select rows and move between pages."
        padding={false}
        actions={<Badge>{selection.length} selected</Badge>}
      >
        <FilterBar
          onReset={() => {
            setQuery('');
            setStatus('all');
            setPage(1);
          }}
        >
          <SearchInput
            label="Find sample records"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by label or reference"
            wrapperClassName="w-full sm:w-64"
          />
          <Select
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            wrapperClassName="w-full sm:w-44"
            options={[
              { value: 'all', label: 'All statuses' },
              ...['VALID', 'REVIEW', 'PENDING', 'FAILED'].map((value) => ({ value, label: value })),
            ]}
          />
        </FilterBar>
        <DataTable
          columns={columns}
          data={filtered.slice((page - 1) * 4, page * 4)}
          caption="Fictional sample records"
          selectedKeys={selection}
          onSelectionChange={setSelection}
          emptyTitle="No matching examples"
          emptyDescription="Try a different search or reset the filters."
          pagination={{ page, pageSize: 4, totalItems: filtered.length, onPageChange: setPage }}
        />
        <p role="status" className="border-t border-default px-4 py-3 text-caption text-muted">
          {message}
        </p>
      </Card>
      <Card title="Table states" padding={false}>
        <div className="p-5">
          <Tabs
            label="Table state examples"
            items={[
              {
                id: 'empty',
                label: 'Empty table',
                content: (
                  <DataTable
                    columns={columns.slice(0, 4)}
                    data={[]}
                    caption="Empty table example"
                  />
                ),
              },
              {
                id: 'loading',
                label: 'Loading table',
                content: (
                  <DataTable
                    columns={columns.slice(0, 4)}
                    loading
                    caption="Loading table example"
                  />
                ),
              },
            ]}
          />
        </div>
      </Card>
    </ShowcaseSection>
  );
}

function OverlaysPreview() {
  const [overlay, setOverlay] = useState(null);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState('No menu action selected.');
  const close = () => setOverlay(null);
  return (
    <ShowcaseSection
      id="overlays"
      number="06"
      title="Overlays & empty states"
      description="Focused interactions with keyboard support and a clear way back."
    >
      <Card
        title="Dialogs, drawers & menus"
        description="Open each example. Escape closes overlays and returns focus to the trigger."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setOverlay('modal')}>Open modal</Button>
          <Button variant="outline" onClick={() => setOverlay('drawer')}>
            Open drawer
          </Button>
          <Button variant="outline" onClick={() => setOverlay('confirm')}>
            Open confirmation
          </Button>
          <Button variant="ghost" onClick={() => setToast(true)}>
            Show notification
          </Button>
          <Dropdown
            label="Example actions"
            items={[
              {
                id: 'view',
                label: 'View example',
                icon: FileText,
                onSelect: () => setMessage('View example selected.'),
              },
              {
                id: 'copy',
                label: 'Copy label',
                icon: FileText,
                onSelect: () =>
                  setMessage('Copy label selected. Preview only; clipboard unchanged.'),
              },
              { id: 'unavailable', label: 'Unavailable action', disabled: true },
              {
                id: 'remove',
                label: 'Remove example',
                danger: true,
                onSelect: () => setOverlay('confirm'),
              },
            ]}
          />
        </div>
        <p role="status" className="mt-4 text-caption text-muted">
          {message}
        </p>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Empty state">
          <EmptyState
            title="Nothing here yet"
            description="Use a clear explanation and offer a useful next step."
            action={
              <Button variant="outline" onClick={() => setToast(true)}>
                Example action
              </Button>
            }
          />
        </Card>
        <Card title="Loading & error states">
          <div className="flex items-center gap-3 border-b border-default pb-4 text-muted">
            <LoadingSpinner label="Loading example content" />
            <span>Loading example content&hellip;</span>
          </div>
          <ErrorState
            description="This is a visual example, not an actual system error."
            onRetry={() => setToast(true)}
          />
        </Card>
      </div>
      <Modal
        open={overlay === 'modal'}
        onClose={close}
        title="Example dialog"
        description="A focused task without leaving the current view."
        footer={
          <>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                close();
                setToast(true);
              }}
            >
              Save example
            </Button>
          </>
        }
      >
        <Input
          label="Example title"
          defaultValue="Fictional reference"
          helperText="This value is never saved or transmitted."
        />
      </Modal>
      <Drawer
        open={overlay === 'drawer'}
        onClose={close}
        title="Example details"
        description="A reusable side panel for contextual information."
        footer={
          <Button variant="outline" onClick={close}>
            Close panel
          </Button>
        }
      >
        <div className="space-y-5">
          <Badge variant="info">Component example</Badge>
          <p className="text-muted">
            Drawers provide additional context while keeping the current page in place.
          </p>
          <Input label="Preview note" placeholder="Enter a fictional note" />
          <AlertBanner title="Local preview only">
            No information entered here is stored.
          </AlertBanner>
        </div>
      </Drawer>
      <ConfirmDialog
        open={overlay === 'confirm'}
        onClose={close}
        title="Remove this example?"
        description="This is a demonstration of a confirmation pattern."
        confirmLabel="Remove example"
        onConfirm={() => {
          close();
          setToast(true);
        }}
      >
        No actual record will be removed. Cancel is focused first to avoid an unintended action.
      </ConfirmDialog>
      <Toast
        open={toast}
        onClose={() => setToast(false)}
        variant="success"
        title="Demo action completed"
      >
        Preview only. No data was saved, changed or removed.
      </Toast>
    </ShowcaseSection>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary p-3 text-surface focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <div className="border-t-4 border-primary border-b border-b-default bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-control border border-default p-2 text-primary">
              <Shield aria-hidden="true" className="icon-lg" />
            </span>
            <div>
              <p className="text-body font-semibold text-navy">
                Border Identity & Document Screening
              </p>
              <p className="text-caption text-muted">Shared interface standards</p>
            </div>
          </div>
          <span className="text-caption font-medium text-muted">FOUNDATION / 01</span>
        </div>
      </div>
      <main id="main-content" tabIndex={-1} className="page-shell space-y-10">
        <div className="space-y-6">
          <PageHeader
            title="Design system"
            eyebrow="Interface reference"
            description="A shared, accessible foundation for a clear and dependable government application. Components only&mdash;no operational screens or live data."
            breadcrumbs={[
              { label: 'Interface reference', href: '/design-system' },
              { label: 'Design system' },
            ]}
            actions={<Badge variant="info">Development preview</Badge>}
          />
          <nav
            aria-label="Component sections"
            className="flex flex-wrap gap-x-6 gap-y-3 border-y border-default py-4"
          >
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={'#' + id}
                className="text-body font-medium text-muted hover:text-primary hover:underline"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <FoundationsPreview />
        <ControlsPreview />
        <StatusPreview />
        <ProgressPreview />
        <TablesPreview />
        <OverlaysPreview />
        <footer className="flex flex-wrap justify-between gap-3 border-t border-default pt-5 text-caption text-muted">
          <p>Shared by Admin, Surveillance Officer and Duty / Border Officer.</p>
          <p>Fictional examples &middot; No connected services</p>
        </footer>
      </main>
    </>
  );
}
