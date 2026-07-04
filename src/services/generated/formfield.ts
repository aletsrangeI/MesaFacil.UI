import { emptySplitApi as api } from "../baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: () => ({}),
  overrideExisting: false,
});
export { injectedRtkApi as enhancedApi };
export const {} = injectedRtkApi;
