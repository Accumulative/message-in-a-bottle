import { useState } from "react";
import CircularProgress from "./CircularProgress";

interface IProps {
  children: any;
  onClick: () => Promise<void> | void;
  isCancel?: boolean;
}

const Button = (props: IProps) => {
  const [isLoading, setLoading] = useState(false);
  const { children, isCancel = false, onClick, ...rest } = props;

  const onClickHandler = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  }

  return (
    <button
      disabled={isLoading}
      className={`${isCancel ? 'bg-red-500 active:bg-red-700 hover:bg-red-300' : 'bg-emerald-500 active:bg-emerald-700 hover:bg-emerald-300'} text-white disabled:bg-slate-50 disabled:text-slate-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg hover:darken outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
      type="button"
      onClick={onClickHandler}
      {...rest}
    >
      {isLoading ? <CircularProgress /> : children}
    </button>
  );
};

export default Button;
