import { useRef } from 'react';
import { Upload } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { acceptedFiles } from '../constants/captureOptions';

export default function FileUpload({
  onFiles,
  disabled,
  label = 'Upload File',
  inputLabel = 'Choose document files',
  multiple = true,
}) {
  const inputRef = useRef(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFiles}
        multiple={multiple}
        disabled={disabled}
        aria-label={inputLabel}
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          event.target.value = '';
          onFiles(files);
        }}
      />
      <Button variant="outline" disabled={disabled} onClick={() => inputRef.current.click()}>
        <Upload aria-hidden="true" className="icon-sm" />
        {label}
      </Button>
    </>
  );
}
