export type FormDataEntryAppender = (
  formData: FormData,
  key: string,
  value: unknown,
) => void;

/**
 * Build FormData from a plain object: only keys present in payload are included.
 * Skips `undefined` values; use `appendEntry` to control how each value is serialized.
 */
export function buildFormDataFromRecord(
  payload: Record<string, unknown>,
  appendEntry: FormDataEntryAppender,
): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) {
      continue;
    }
    appendEntry(formData, key, value);
  }
  return formData;
}

/** Append rules for hospital org PATCH multipart (images, logo, imageOrder). */
export function appendHospitalOrgFormDataEntry(
  formData: FormData,
  key: string,
  value: unknown,
): void {
  if (key === 'images' && Array.isArray(value)) {
    const files = value.filter((v): v is File => v instanceof File);
    for (const file of files) {
      formData.append('images', file, file.name);
    }
    return;
  }
  if (key === 'imageOrder' && Array.isArray(value)) {
    formData.append('imageOrder', JSON.stringify(value));
    return;
  }
  if (key === 'image') {
    if (value instanceof File) {
      formData.append('image', value, value.name);
    } else if (value === null) {
      formData.append('clearLogo', 'true');
    }
    return;
  }
  if (value === null) {
    formData.append(key, '');
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      formData.append(key, String(item));
    }
    return;
  }
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    formData.append(key, String(value));
  }
}

/**
 * Build FormData for hospital org PATCH.
 * `null` values are sent as empty string so the backend can clear fields (e.g. optional text).
 */
export function buildHospitalOrgFormData(payload: Record<string, unknown>): FormData {
  return buildFormDataFromRecord(payload, appendHospitalOrgFormDataEntry);
}
