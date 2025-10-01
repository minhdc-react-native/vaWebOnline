export const KEY_STORAGE = {
  TOKEN: 'token',
  YEAR_SELECTED: 'year-selected',
  ORG_UNIT: 'org-unit',
  SUB_DOMAIN: 'sub-domain',
  INFO_LOGIN: 'info-login'
};

const getData = (key: string): any | undefined => {
  try {
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Read from local storage', error);
  }
};

const setData = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Save in local storage', error);
  }
};

const removeData = (key: string): any | undefined => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Read from local storage', error);
  }
};

export { getData, setData, removeData };
