import React, { useEffect, useState } from "react";
import { ReactComponent as MessageIcon } from "../assets/Icons/Messages.svg";
import { ReactComponent as BarsCode } from "../assets/Icons/bars-solid.svg";
import { ReactComponent as XIcon } from "../assets/Icons/X.svg";
import ServerURL from "../utils/ServerURL";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import CommonUtil from "../utils/CommonUtil";
import ApiConnector from "../utils/ApiConnector";
import SocketActions from "../utils/SocketActions";
import Constants from "../utils/constants";
import Modal from "../components/Modal";
import axios from "axios";

let socket = new WebSocket(
  ServerURL.WS_BASE_URL + `/ws/users/${CommonUtil.getUserId()}/chat/`
);

let typingTimer = 0;
let isTypingSignalSent = false;

const Messages = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user.role;

  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState(role === "teacher" ? "parent" : "teacher");

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState({});

  const [chatUsers, setChatUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isShowAddPeopleModal, setIsShowAddPeopleModal] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);

  const [typing, setTyping] = useState(false);
  const [onlineUserList, setOnlineUserList] = useState([]);

  const redirectUserToDefaultChatRoom = (chatUsers) => {
    if (chatUsers?.length === 0) return navigate("/messages");
    if (location.pathname === "/messages") {
      navigate("/message/" + chatUsers[0].roomId);
    } else {
      const activeChatId = CommonUtil.getActiveChatId(params);
      const chatUser = chatUsers.find((user) => user.roomId === activeChatId);
      if (!chatUser) {
        navigate("/message/" + chatUsers[0].roomId);
      }
    }
  };

  const fetchChatMessage = async () => {
    const currentChatId = CommonUtil.getActiveChatId(params);
    if (currentChatId) {
      const url = `/chats/${currentChatId}/messages/?limit=20&offset=0`;
      const chatMessages = await ApiConnector.sendGetRequest(url);
      setMessages(chatMessages);
    }
  };

  const filterChatUser = async (formatedChatUser) => {
    setChatUsers(formatedChatUser);
    setTeachers(formatedChatUser?.filter((item) => item.role === "teacher"));
    setStudents(formatedChatUser?.filter((item) => item.role === "student"));
    setParents(formatedChatUser?.filter((item) => item.role === "parent"));
    redirectUserToDefaultChatRoom(formatedChatUser);
  };

  const fetchChatUser = async () => {
    const url = `/chats/?user=${CommonUtil.getUserId()}`;
    const chatUsers = await ApiConnector.sendGetRequest(url);
    const formatedChatUser = await CommonUtil.getFormatedChatUser(
      chatUsers,
      onlineUserList
    );
    setChatUsers(formatedChatUser);
    setTeachers(formatedChatUser?.filter((item) => item.role === "teacher"));
    setStudents(formatedChatUser?.filter((item) => item.role === "student"));
    setParents(formatedChatUser?.filter((item) => item.role === "parent"));
    redirectUserToDefaultChatRoom(formatedChatUser);
  };
  const loggedInUserId = CommonUtil.getUserId();
  const getChatMessageClassName = (userId) => {
    return loggedInUserId === userId ? "message mime" : "message other";
  };
  /* eslint-disable */
  useEffect(() => {
    fetchChatUser();
  }, []);

  useEffect(() => {
    fetchChatMessage();
    connectSocket();
  }, [CommonUtil.getActiveChatId(params)]);
  /* eslint-enable */
  const getConnectedUserIds = () => {
    let connectedUsers = "";
    chatUsers?.forEach((chatUser) => {
      connectedUsers += chatUser.id + ",";
    });
    return connectedUsers.slice(0, -1);
  };

  const fetchUsers = async () => {
    const url = "/users/?exclude=" + getConnectedUserIds();
    const users = await ApiConnector.sendGetRequest(url);
    setUsers(users);
  };

  const addPeopleClickHandler = async () => {
    await fetchUsers();
    setIsShowAddPeopleModal(true);
  };

  const addMemberClickHandler = async (memberId) => {
    const userId = CommonUtil.getUserId();
    let requestBody = {
      members: [memberId, userId],
      type: "DM",
    };
    const chatUser = await ApiConnector.sendPostRequest(
      "/chats/",
      JSON.stringify(requestBody),
      true,
      false
    );
    const formatUser = await CommonUtil.getFormatedChatUser(
      [chatUser],
      onlineUserList
    );
    await filterChatUser([...chatUsers, formatUser[0]]);
    setIsShowAddPeopleModal(false);
  };

  const removeMemberClickHandler = async (roomId) => {
    const requestBody = {
      roomId: roomId,
    };
    axios
      .post(ServerURL.BASE_URL + `/chats/`, requestBody)
      .then(() => {
        const formatUsers = chatUsers.filter((item) => item.roomId !== roomId);
        filterChatUser(formatUsers);
        redirectUserToDefaultChatRoom(formatUsers);
      })
      .catch((err) => console.error(err));
  };

  const getActiveChatClass = (roomId) => {
    let activeChatId = CommonUtil.getActiveChatId(params);
    return roomId === activeChatId ? "active-chat" : "";
  };

  const getChatListWithOnlineUser = (users) => {
    let updatedChatList = users?.map((user) => {
      if (onlineUserList.includes(user.id)) {
        user.isOnline = true;
      } else {
        user.isOnline = false;
      }
      return user;
    });
    return updatedChatList;
  };

  const connectSocket = () => {
    socket = new WebSocket(
      ServerURL.WS_BASE_URL + `/ws/users/${CommonUtil.getUserId()}/chat/`
    );

    socket.onclose = () => {
      setTimeout(connectSocket, 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const chatId = CommonUtil.getActiveChatId(params);
      const userId = CommonUtil.getUserId();
      if (chatId === data.roomId) {
        if (data.action === SocketActions.MESSAGE) {
          data["userImage"] = ServerURL.BASE_URL + data.userImage;
          setMessages((prevState) => {
            let messagesState = JSON.parse(JSON.stringify(prevState));
            messagesState.results.unshift(data);
            return messagesState;
          });
          setTyping(false);
        } else if (
          data.action === SocketActions.TYPING &&
          data.user !== userId
        ) {
          setTyping(data.typing);
        }
      }
      if (data.action === SocketActions.ONLINE_USER) {
        setOnlineUserList(data.userList);
      }
    };
  };

  const messageSubmitHandler = async (event) => {
    event.preventDefault();
    if (inputMessage) {
      try {
        socket.send(
          JSON.stringify({
            action: SocketActions.MESSAGE,
            message: inputMessage,
            user: CommonUtil.getUserId(),
            roomId: CommonUtil.getActiveChatId(params),
          })
        );
      } catch (err) {
        console.error(err);
      }
    }
    setInputMessage("");
  };

  const sendTypingSignal = async (typing) => {
    try {
      socket.send(
        JSON.stringify({
          action: SocketActions.TYPING,
          typing: typing,
          user: CommonUtil.getUserId(),
          roomId: CommonUtil.getActiveChatId(params),
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const chatMessageTypingHandler = (event) => {
    if (event.keyCode !== Constants.ENTER_KEY_CODE) {
      if (!isTypingSignalSent) {
        sendTypingSignal(true);
        isTypingSignalSent = true;
      }
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        sendTypingSignal(false);
        isTypingSignalSent = false;
      }, 3000);
    } else {
      clearTimeout(typingTimer);
      isTypingSignalSent = false;
    }
  };

  return (
    <>
      <div className="container messages">
        <div className="card messages">
          <div className="messages">
            <div className="row">
              <div className="title">Messages</div>
              <div className="icon" onClick={() => setOpen(true)}>
                <BarsCode />
              </div>
            </div>

            <div className="chat-messages">
              {typing && (
                <div className="chat-message-left chat-bubble mb-1">
                  <div className="typing">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
              {messages["results"]?.map((message, index) => (
                <div
                  key={index}
                  className={getChatMessageClassName(message.user)}
                >
                  <div className="name">
                    {message.userName}
                    <div className="text-muted">
                      {CommonUtil.getTimeFromDate(message.timestamp)}
                    </div>
                  </div>
                  <div className="detail">
                    <div className="avatar">
                      <img
                        src={message.userImage}
                        alt={message.userName}
                        width="40"
                        height="40"
                      />
                    </div>
                    <div className="text">{message.message}</div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={messageSubmitHandler}>
              <div className="chat">
                <input
                  type="text"
                  placeholder="Type a new message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyUp={chatMessageTypingHandler}
                  autoComplete="off"
                />
                <button className="icon">
                  <MessageIcon />
                </button>
              </div>
            </form>
          </div>
          <div className={open ? "users active" : "users"}>
            <div className="close">
              <div className="icon" onClick={() => setOpen(false)}>
                <XIcon />
              </div>
              <div className="btn" onClick={addPeopleClickHandler}>
                Add People
              </div>
            </div>

            <div className="user-list-container">
              {role !== "student" && (
                <div className="part">
                  <div className="title">Students</div>

                  <div className="col">
                    {getChatListWithOnlineUser(students)?.map((student) => (
                      <Link
                        className={"item " + getActiveChatClass(student.roomId)}
                        to={"/message/" + student.roomId}
                        key={student.roomId}
                      >
                        <div className="avatar">
                          <img src={student.image} alt="Avatar" />
                        </div>
                        <div className="detail">
                          <div className="name">{student.name}</div>
                          <div className="action">
                            <div className="status">
                              {student.isOnline ? (
                                <>
                                  <div className="circle green" />
                                  <div className="text">Online</div>
                                </>
                              ) : (
                                <>
                                  <div className="circle red" />
                                  <div className="text">Offline</div>
                                </>
                              )}
                            </div>
                            <div
                              className={"action remove"}
                              onClick={() =>
                                removeMemberClickHandler(student.roomId)
                              }
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {role !== "teacher" && (
                <div className="part">
                  <div className="title">Teacher</div>

                  <div className="col">
                    {getChatListWithOnlineUser(teachers)?.map((teacher) => (
                      <Link
                        className={"item " + getActiveChatClass(teacher.roomId)}
                        to={"/message/" + teacher.roomId}
                        key={teacher.roomId}
                      >
                        <div className="avatar">
                          <img src={teacher.image} alt="Avatar" />
                        </div>
                        <div className="detail">
                          <div className="name">{teacher.name}</div>
                          <div className="action">
                            <div className="status">
                              {teacher.isOnline ? (
                                <>
                                  <div className="circle green" />
                                  <div className="text">Online</div>
                                </>
                              ) : (
                                <>
                                  <div className="circle red" />
                                  <div className="text">Offline</div>
                                </>
                              )}
                            </div>
                            <div
                              className={"action remove"}
                              onClick={() =>
                                removeMemberClickHandler(teacher.roomId)
                              }
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {role !== "parent" && (
                <div className="part">
                  <div className="title">Parents</div>
                  <div className="col">
                    {getChatListWithOnlineUser(parents)?.map((parent) => (
                      <Link
                        className={"item " + getActiveChatClass(parent.roomId)}
                        to={"/message/" + parent.roomId}
                        key={parent.roomId}
                      >
                        <div className="avatar">
                          <img src={parent.image} alt="Avatar" />
                        </div>
                        <div className="detail">
                          <div className="name">{parent.name}</div>
                          <div className="action">
                            <div className="status">
                              {parent.isOnline ? (
                                <>
                                  <div className="circle green" />
                                  <div className="text">Online</div>
                                </>
                              ) : (
                                <>
                                  <div className="circle red" />
                                  <div className="text">Offline</div>
                                </>
                              )}
                            </div>
                            <div
                              className="action remove"
                              onClick={() =>
                                removeMemberClickHandler(parent.roomId)
                              }
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        modalCloseHandler={() => setIsShowAddPeopleModal(false)}
        show={isShowAddPeopleModal}
      >
        <div className="tabs">
          {role !== "teacher" && (
            <div
              className={tab === "teacher" ? "tab active" : "tab"}
              onClick={() => setTab("teacher")}
            >
              Teacher
            </div>
          )}
          {role !== "parent" && (
            <div
              className={tab === "parent" ? "tab active" : "tab"}
              onClick={() => setTab("parent")}
            >
              Parent
            </div>
          )}
          {role !== "student" && (
            <div
              className={tab === "student" ? "tab active" : "tab"}
              onClick={() => setTab("student")}
            >
              Student
            </div>
          )}
        </div>
        <div className="users">
          {role !== "teacher" &&
            tab === "teacher" &&
            (users.filter((item) => item.role === "teacher").length > 0 ? (
              users
                .filter((item) => item.role === "teacher")
                .map((user) => (
                  <div key={user.id} className="user">
                    <img
                      src={ServerURL.BASE_URL + user.image}
                      className="image"
                      alt={user.name}
                      width="40"
                      height="40"
                    />
                    <div className="name">{user.name}</div>
                    <div
                      className="btn"
                      onClick={() => addMemberClickHandler(user.id)}
                    >
                      Add
                    </div>
                  </div>
                ))
            ) : (
              <h3>No More Teacher Found</h3>
            ))}
          {role !== "parent" &&
            tab === "parent" &&
            (users.filter((item) => item.role === "parent").length > 0 ? (
              users
                .filter((item) => item.role === "parent")
                .map((user) => (
                  <div key={user.id} className="user">
                    <img
                      src={ServerURL.BASE_URL + user.image}
                      className="image"
                      alt={user.name}
                      width="40"
                      height="40"
                    />
                    <div className="name">{user.name}</div>
                    <div
                      className="btn"
                      onClick={() => addMemberClickHandler(user.id)}
                    >
                      Add
                    </div>
                  </div>
                ))
            ) : (
              <h3>No More Parent Found</h3>
            ))}
          {role !== "student" &&
            tab === "student" &&
            (users.filter((item) => item.role === "student").length > 0 ? (
              users
                .filter((item) => item.role === "student")
                .map((user) => (
                  <div key={user.id} className="user">
                    <img
                      src={ServerURL.BASE_URL + user.image}
                      className="image"
                      alt={user.name}
                      width="40"
                      height="40"
                    />
                    <div className="name">{user.name}</div>
                    <div
                      className="btn"
                      onClick={() => addMemberClickHandler(user.id)}
                    >
                      Add
                    </div>
                  </div>
                ))
            ) : (
              <h3>No More Student Found</h3>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default Messages;
