export const extractData = (response: any) => {
  return response?.data?.data || {};
};

export const extractMeta = (response: any) => {
  return response?.data?.meta || {};
};
