export function getSearchResult(state) {
  return state.searchResult;
}

export function getCustInfo(state) {
  return state.custInfo;
}

export function getFssData(state) {
  return state.fssData;
}

export function getScData(state) {
  return state.scData;
}

export function getScList(state) {
  return state.scList;
}

export function isLoggedIn(state) {
  return !!state.loginInfo.loginToken;
}

export function getLoginInfo(state) {
  return state.loginInfo;
}
