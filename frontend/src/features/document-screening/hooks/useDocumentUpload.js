import { useEffect, useRef, useState } from 'react';
import { captureInstructions, maxDocuments } from '../constants/captureOptions';
import { validateDocumentFile } from '../utils/documentFiles';

export default function useDocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const [documentType, setDocumentType] = useState('Passport');
  const [pageLabel, setPageLabel] = useState('Identity page');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [notice, setNotice] = useState('');
  const urls = useRef(new Set());
  const mounted = useRef(false);
  const processing = useRef(false);
  useEffect(() => {
    mounted.current = true;
    const previews = urls.current;
    return () => {
      mounted.current = false;
      previews.forEach((url) => URL.revokeObjectURL(url));
      previews.clear();
    };
  }, []);
  function revoke(url) {
    if (url) {
      URL.revokeObjectURL(url);
      urls.current.delete(url);
    }
  }
  function resetConfirmation() {
    setConfirmed(false);
    setSubmissionError('');
  }
  async function addFiles(fileList, replaceId = null, source = 'File upload', signal) {
    const files = Array.from(fileList || []);
    if (!files.length || processing.current || signal?.aborted || !mounted.current) return false;
    setError('');
    setNotice('');
    if (documents.length + (replaceId ? 0 : files.length) > maxDocuments) {
      setError('Add up to 10 documents per demo screening. Remove a document before adding more.');
      return false;
    }
    if (replaceId && files.length !== 1) {
      setError('Choose one file when replacing a document.');
      return false;
    }
    const original = documents.find((item) => item.id === replaceId);
    if (replaceId && !original) return false;
    processing.current = true;
    setBusy(true);
    const prepared = [];
    try {
      for (const file of files) {
        const result = await validateDocumentFile(file);
        if (!mounted.current || signal?.aborted) return false;
        if (result.error) {
          setError(file.name + ': ' + result.error);
          return false;
        }
        prepared.push({ file, mime: result.mime });
      }
      const additions = prepared.map(({ file, mime }) => {
        const previewUrl = mime.startsWith('image/') ? URL.createObjectURL(file) : null;
        if (previewUrl) urls.current.add(previewUrl);
        return {
          id: original?.id || crypto.randomUUID(),
          file,
          name: file.name,
          mime,
          size: file.size,
          previewUrl,
          documentType: original?.documentType || documentType,
          pageLabel: original?.pageLabel || pageLabel,
          capturedAt: new Date().toISOString(),
          source,
        };
      });
      setDocuments((current) =>
        original
          ? current.map((item) => (item.id === replaceId ? additions[0] : item))
          : [...current, ...additions],
      );
      if (original) revoke(original.previewUrl);
      setSelectedId(additions[0].id);
      resetConfirmation();
      setNotice(
        original
          ? 'Document replaced locally. Review and confirm the updated documents.'
          : additions.length +
              (additions.length === 1 ? ' document added locally.' : ' documents added locally.') +
              ' No files were uploaded to a server.',
      );
      return true;
    } catch {
      if (mounted.current)
        setError('This file could not be read. Please select it again or choose another file.');
      return false;
    } finally {
      processing.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  function removeDocument(id) {
    if (processing.current) return;
    const removed = documents.find((item) => item.id === id);
    const remaining = documents.filter((item) => item.id !== id);
    revoke(removed?.previewUrl);
    setDocuments(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id || null);
    resetConfirmation();
    setError('');
    setNotice('Document removed from this local screening.');
  }
  function updatePage(id, value) {
    setDocuments((current) =>
      current.map((item) => (item.id === id ? { ...item, pageLabel: value } : item)),
    );
    resetConfirmation();
  }
  function validateReady() {
    if (!documents.length) {
      setSubmissionError('Add at least one document before starting screening.');
      return false;
    }
    if (!confirmed) {
      setSubmissionError(
        'Confirm that you have reviewed the captured documents before starting screening.',
      );
      return false;
    }
    setSubmissionError('');
    return !processing.current;
  }
  return {
    documents,
    documentType,
    pageLabel,
    selectedDocument: documents.find((item) => item.id === selectedId) || null,
    confirmed,
    busy,
    error,
    submissionError,
    notice,
    addFiles,
    removeDocument,
    updatePage,
    validateReady,
    selectDocument: setSelectedId,
    setPageLabel,
    changeDocumentType: (value) => {
      setDocumentType(value);
      setPageLabel(captureInstructions[value].pages[0]);
    },
    confirmDocuments: (value) => {
      setConfirmed(value);
      setSubmissionError('');
    },
  };
}
