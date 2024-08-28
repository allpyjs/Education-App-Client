import Constants from "./constants";
import CookieUtil from "./CookieUtil";
import HttpStatusCode from "./HttpStatusCodes";

const statusHandler = (response) => {
  return response.status === HttpStatusCode.OK ||
    response.status === HttpStatusCode.CREATED
    ? Promise.resolve(response)
    : Promise.reject(response);
};

const jsonHandler = (response) => {
  return response.json();
};

const getPostRequestHeader = () => {
  return {
    Accept: "application/json, text/plain",
    "Content-Type": "application/json; charset=UTF-8",
  };
};

const getAuthHeader = () => {
  return {
    Authorization: "Bearer " + CookieUtil.getCookie(Constants.ACCESS_PROPERTY),
  };
};

const ApiUtils = {
  statusHandler: statusHandler,
  jsonHandler: jsonHandler,
  getPostRequestHeader: getPostRequestHeader,
  getAuthHeader: getAuthHeader,
};

export default ApiUtils;
