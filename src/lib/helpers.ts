const ERROR_MESSAGES = {
  UNKNOWN: "Đã xảy ra lỗi không xác định",
  NETWORK: "Lỗi kết nối mạng",
  SERVER: "Lỗi máy chủ",
  TIMEOUT: "Yêu cầu hết thời gian"
} as const;

export const throttle = (
  func: (...args: unknown[]) => void,
  limit: number,
): ((...args: unknown[]) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    if (lastRan === null) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc !== null) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(
        () => {
          if (Date.now() - (lastRan as number) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - (lastRan as number)),
      );
    }
  };
};

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function uid(): string {
  return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}

export function getInitials(
  name: string | null | undefined,
  count?: number,
): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase());

  return count && count > 0
    ? initials.slice(0, count).join('')
    : initials.join('');
}

export function toAbsoluteUrl(pathname: string): string {
  const baseUrl = import.meta.env.BASE_URL;

  if (baseUrl && baseUrl !== '/') {
    return import.meta.env.BASE_URL + pathname;
  } else {
    return pathname;
  }
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  if (diff < 2592000)
    return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) > 1 ? 's' : ''} ago`;
  if (diff < 31536000)
    return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? 's' : ''} ago`;

  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? 's' : ''} ago`;
}

export function formatDate(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

export const getMessageError = (error: any) => {
  let msgError: string;
  if (!error) msgError = ERROR_MESSAGES.UNKNOWN;
  if (error.error) {
    if (error.error.validationErrors) {
      const _errors = error.error.validationErrors;
      msgError = "";
      _errors.forEach((e: { message: string }) => {
        msgError += e.message + "\n";
      });
      return msgError;
    } else if (error.error.message) {
      return error.error.message;
    } else if (error.error.details) {
      return error.error.details;
    } else {
      return ERROR_MESSAGES.UNKNOWN;
    }
  }
}
export const getError = (error: any) => {
  if (!error) {
    return { message: ERROR_MESSAGES.UNKNOWN };
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data) {
    return error.response.data;
  }

  if (error.message) {
    return { message: error.message };
  }

  return { message: ERROR_MESSAGES.UNKNOWN };
}

export function getSupabaseUrl() {
  const hostname = window.location.hostname;
  if (hostname.includes('localhost')) {
    return "https://demoketoan.vaonline.vn";
  }
  return `https://${hostname}`;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sortTreeFlat(data: IData[], codeField?: string) {
  const grouped = new Map<string | null, IData[]>();
  data.forEach(item => {
    if (!grouped.has(item.parentId)) {
      grouped.set(item.parentId, []);
    }
    grouped.get(item.parentId)!.push(item);
  });

  if (codeField) {
    grouped.forEach((arr, key) => {
      arr.sort((a, b) => {
        const codeA = a[codeField] ?? "";
        const codeB = b[codeField] ?? "";
        return String(codeA).localeCompare(String(codeB));
      });
    });
  }
  const result: IData[] = [];
  function traverse(parentId: string | null) {
    const children = grouped.get(parentId) || [];
    for (const child of children) {
      result.push(child);
      traverse(child.id.toString());
    }
  }
  traverse(null);
  return result;
}

export function isNotEmpty(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (typeof value === "number" && value === 0) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && Object.keys(value).length === 0) return false;
  return true;
};