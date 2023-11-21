export const USER_INFO_KEY = "user-info";

export const storeUserInfo = (data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(data));
  }
};

export const userInfo = (): any => {
  if (typeof window !== 'undefined') {
    const userInfoString = localStorage && localStorage.getItem(USER_INFO_KEY);
    return userInfoString ? JSON.parse(userInfoString) : {};
  }
};

export const clearUserInfo = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_INFO_KEY);
  }
};