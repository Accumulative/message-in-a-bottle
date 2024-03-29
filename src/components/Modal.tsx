import React from 'react';
import Button from './Button';

interface IProps {
  showModal: boolean;
  closeModel: (result: boolean) => void;
  title: string;
  children: any;
  actionButton?: {
    hide?: boolean;
    text?: string;
  };
}

export default function Modal(props: IProps) {
  const { showModal, closeModel, title, children, actionButton } = props;
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">{children}</div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <Button
                    isCancel
                    onClick={() => closeModel(false)}
                  >
                    Close
                  </Button>
                  {!actionButton?.hide && (
                    <Button
                      onClick={() => closeModel(true)}
                    >
                      {actionButton?.text || 'Send'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
