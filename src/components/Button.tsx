import { useState } from "react";
import CircularProgress from "./CircularProgress";

interface IProps {
  children: any;
  onClick: () => Promise<void> | void;
  color?: 'emerald' | 'red';
}

const Button = (props: IProps) => {
  const [isLoading, setLoading] = useState(false);
  const { children, color, onClick, ...rest } = { color: 'emerald', ...props };

  const onClickHandler = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  }

  return (
    <button
      disabled={isLoading}
      className={`bg-${color}-500 text-white disabled:bg-slate-50 disabled:text-slate-500 active:bg-${color}-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
      type="button"
      onClick={onClickHandler}
      {...rest}
    >
      {isLoading ? <CircularProgress /> : children}
    </button>
  );
};

export default Button;
