export const codeErrorMap: any = {};

export function parseErrorLog(e: any) {
  if (e?.errorMsg?.detail) {
    return e?.errorMsg?.detail;
  }

  if (e?.errorMsg?.message) {
    return e?.errorMsg?.message;
  }

  if (e?.reason) {
    return e?.reason;
  }

  if (e?.errorMsg?.shortMessage) {
    return e?.errorMsg?.shortMessage;
  }

  return e;
}

export function getErrorMessage(e: any) {
  const errorMessage = codeErrorMap[e.code];
  return errorMessage || e.message || `Unknown error with code: ${e.code}`;
}

export function getErrorObject(e: any) {
  if (e.code) {
    return { code: e.code, message: getErrorMessage(e) };
  }

  if (e.status) {
    return { code: e.status, message: getErrorMessage({ code: e.status, message: e.message }) };
  }

  if (e.detail) {
    return { code: 0, message: e.detail };
  }

  console.error('Unknown api error: ', e);

  if (e.message) {
    return { code: 0, message: e.message };
  }

  return { code: 0, message: 'Unknown error' };
}
