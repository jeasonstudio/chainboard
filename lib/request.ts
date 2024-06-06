export interface RequestOptions extends RequestInit {
  throwOnError?: boolean;
}

export const request = <T extends any>(
  pathname: string,
  params?: RequestOptions
) => {
  const { throwOnError, ...options } = params || {};
  return fetch(pathname, options).then<T>((response) => response.json());
  // .catch((error) => {
  //   if (throwOnError) {
  //     throw error;
  //   } else {
  //     console.error(error);
  //   }
  // });
};
