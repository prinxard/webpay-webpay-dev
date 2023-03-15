const CustomButton = ({ children, ...props }) => {
  return (
    <button
      className={`inline-flex disabled:opacity-50 focus:outline-none focus:ring-0 focus:ring-offset-0 border rounded-full text-center py-1 px-6 border-solid border-green-500 hover:bg-green-400 hover:text-white ${
        props.disabled && 'cursor-not-allowed'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;

export const NewButton = ({ title, color, animation, icon, ...props }) => {
  return (
    <button
      {...props}
      className={`${
        animation && animation
      } btn btn-default btn-outlined  mr-4 bg-transparent text-${color}-500 hover:text-${color}-700 border-${color}-500 hover:border-${color}-700`}
    >
      <div className="flex overflow-hidden">
        <span className="animate-bounce"> {icon}</span>
        {title}
      </div>
    </button>
  );
};

export const SubmitButton = ({ children, ...props }) => {
  return (
    <button
      className={`inline-flex disabled:opacity-50 bg-green-500 py-2 px-6 rounded-md  text-white border hover:text-green-500 hover:bg-white hover:border-green-500 ${
        props.disabled && 'cursor-not-allowed'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
export const ETransactButton = ({ children, ...props }) => {
  return (
    <button
      className={`inline-flex disabled:opacity-50 bg-blue-500 py-2 px-6 rounded-md  text-white border hover:text-blue-500 hover:bg-white hover:border-blue-500 ${
        props.disabled && 'cursor-not-allowed'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
export const RemitaButton = ({ children, ...props }) => {
  return (
    <button
      className={`inline-flex disabled:opacity-50 bg-yellow-500 py-2 px-6 rounded-md  text-white border hover:text-yellow-600 hover:bg-white hover:border-yellow-600 ${
        props.disabled && 'cursor-not-allowed'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export const DeleteButton = ({ children, ...props }) => {
  return (
    <button
      className={`inline-flex disabled:opacity-50 bg-red-500 py-2 px-8 rounded-md  text-white border hover:text-red-500 hover:bg-white hover:border-red-500 ${
        props.disabled && 'cursor-not-allowed'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
