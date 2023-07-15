import { Pagination } from 'nestjs-typeorm-paginate';

export const getPath = (host: string, requestUrl: string, data: any) => {
  if (data instanceof Pagination) {
    const url = new URL(`${host}${requestUrl}`);

    if (!url.searchParams.get('page') && !url.searchParams.get('limit')) {
      const { meta } = data;

      url.searchParams.set('page', meta.currentPage.toString());
      url.searchParams.set('limit', meta.itemsPerPage.toString());

      const appUrl = url.toString();

      return appUrl.slice(appUrl.indexOf('/'));
    }
  }

  return requestUrl;
};