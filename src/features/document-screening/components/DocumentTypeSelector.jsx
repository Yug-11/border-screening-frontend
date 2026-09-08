import Select from '../../../components/ui/Select';
import { captureDocumentTypes, captureInstructions } from '../constants/captureOptions';

export default function DocumentTypeSelector({
  documentType,
  pageLabel,
  onTypeChange,
  onPageChange,
  disabled,
}) {
  const configuration = captureInstructions[documentType];
  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Document type"
          value={documentType}
          onChange={(event) => onTypeChange(event.target.value)}
          disabled={disabled}
          options={captureDocumentTypes.map((value) => ({ value, label: value }))}
        />
        <Select
          label="Page / side for next file"
          value={pageLabel}
          onChange={(event) => onPageChange(event.target.value)}
          disabled={disabled}
          options={configuration.pages.map((value) => ({ value, label: value }))}
        />
      </div>
      <p role="status" className="text-body text-muted">
        {configuration.instruction}
      </p>
      <p className="text-caption text-muted">
        Applies to newly added files only. Existing documents keep their type and page label.
      </p>
    </div>
  );
}
