interface IProps {
  text: string;
  onClick: () => void;
  color?: 'emerald' | 'red';
}

const Button = (props: IProps) => {
  const { text, color, ...rest } = { color: 'emerald', ...props };
  return (
    <button
      className={`bg-${color}-500 text-white active:bg-${color}-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
      type="button"
      {...rest}
    >
      {text}
    </button>
  );
};

export default Button;
