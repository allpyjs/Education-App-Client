import jwt_decode from "jwt-decode";
import Constants from "./constants";
import CookieUtil from "./CookieUtil";

const is_date = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    return true;
  }
  return false;
};

const getTimeFromDate = (date) => {
  let dateObj = is_date(date) ? date : new Date(date);
  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();
  let meridian = "am";
  if (hour > 12) {
    hour -= 12;
    meridian = "pm";
  }
  if (hour === 0) {
    hour = 12;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return hour + ":" + minute + " " + meridian;
};

const getUserId = () => {
  let token = CookieUtil.getCookie(Constants.ACCESS_PROPERTY);
  if (token) {
    let decodedToken = jwt_decode(token);
    return decodedToken.userId;
  }
  return "";
};

const getFormatedChatUser = (chatUsers, onlineUserList) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  try {
    return chatUsers.reduce((acumulator, item) => {
      if (item.type === "DM" || item.type === "SELF") {
        let newResult = {};
        newResult["roomId"] = item.roomId;
        let member = null;
        for (let user of item.member) {
          if (user.id !== userId || item.type === "SELF") {
            member = user;
          }
        }
        if (member) {
          newResult["role"] = member.role;
          newResult["name"] = member.name;
          newResult["image"] = member.image;
          newResult["id"] = member.id;
          newResult["isOnline"] = onlineUserList?.includes(member.id);
        }
        acumulator.push(newResult);
        return acumulator;
      }
      return acumulator;
    }, []);
  } catch {}
};

const getActiveChatId = (params) => {
  return params ? params.chatId : null;
};

const CommonUtil = {
  getTimeFromDate: getTimeFromDate,
  getUserId: getUserId,
  getFormatedChatUser: getFormatedChatUser,
  getActiveChatId: getActiveChatId,
};

export default CommonUtil;
