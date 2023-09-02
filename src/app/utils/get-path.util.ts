export const getPath = (requestUrl: string, data: any) => {
  if (data && 'items' in data && 'meta' in data) {
    const { meta } = data;
    const { currentPage, itemsPerPage } = meta;
    const queryParams = getQueryParams(requestUrl);
    const updatedQueryParams = addPageOrLimitParams(
      queryParams,
      currentPage,
      itemsPerPage,
    );

    const queryString = Object.keys(updatedQueryParams)
      .map((key) => `${key}=${updatedQueryParams[key]}`)
      .join('&');

    return `${requestUrl.split('?')[0]}?${queryString}`;
  }

  return requestUrl;
};

const getQueryParams = (url: string): Record<string, any> => {
  const params = {};
  const urlParts = url.split('?');

  if (urlParts.length > 1) {
    const queryString = urlParts[1];
    const keyValuePairs = queryString.split('&');
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      params[key] = value;
    });
  }

  return params;
};

const addPageOrLimitParams = (
  queryParams: Record<string, any>,
  currentPage: any,
  itemsPerPage: any,
): Record<string, any> => {
  const params = { ...queryParams };

  if (!params.hasOwnProperty('page')) {
    params['page'] = currentPage.toString();
  }

  if (!params.hasOwnProperty('limit')) {
    params['limit'] = itemsPerPage.toString();
  }

  const page = params['page'];
  const limit = params['limit'];
  delete params['page'];
  delete params['limit'];
  params['page'] = page;
  params['limit'] = limit;

  return params;
};
