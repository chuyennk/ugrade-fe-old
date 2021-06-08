export default function () {
  const loginInfo = {
    loginToken: "",
    loginUser: {},
  };

  const custInfo = {};

  const fssData = {
    fssInfo: {},
    fssHeaders: [],
    fssItems: [],
  };

  const scData = {};
  const scList = [];

  const searchResult = {
    strSearch: "",
    message: "",
    results: [],
  };

  return {
    loginInfo,
    custInfo,
    fssData,
    scData,
    scList,
    searchResult,
  };
}
