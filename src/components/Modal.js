import React, { useRef } from "react";

const Modal = ({ modalCloseHandler, show, children }) => {
  const modalBodyRef = useRef();

  const modalOutsideClickHandler = (event) => {
    if (!modalBodyRef.current.contains(event.target)) {
      modalCloseHandler();
    }
  };

  return (
    <div
      onClick={modalOutsideClickHandler}
      className="modal"
      style={show ? { display: "block" } : { display: "none" }}
    >
      <section className="modal-main" ref={modalBodyRef}>
        <div className="text-right">
          <span
            className="modal-close"
            onClick={modalCloseHandler}
            aria-hidden="true"
          >
            ×
          </span>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
