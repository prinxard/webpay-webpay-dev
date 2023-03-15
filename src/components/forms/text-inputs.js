import React from "react";
export const TextInput = React.forwardRef((props, ref) => {
  let inline = false;

  return (
    <div className={`form-element  ${inline ? "form-element-inline" : ""}`}>
      <div className="form-label">{props.label}</div>
      <div className="flex">
        <input
          ref={ref}
          {...props}
          type="text"
          className={`form-input ${props.bordercolor}`}
          placeholder={props.placeholder}
        />
        <div className="relative">
          <div className="absolute right-2 top-2">{props.loader}</div>
        </div>
      </div>
    </div>
  );
});

export const InvalidTextInput = ({ inline = false }) => (
  <div className={`form-element ${inline ? "form-element-inline" : ""}`}>
    <div className="form-label">First name</div>
    <input
      name="name"
      type="text"
      className="form-input form-input-invalid"
      placeholder="john@example.com"
    />
    <div className="form-error">First name is required</div>
  </div>
);

export const ValidTextInput = ({ inline = false }) => (
  <div className={`form-element ${inline ? "form-element-inline" : ""}`}>
    <div className="form-label">First name</div>
    <input
      name="name"
      type="text"
      className="form-input form-input-valid"
      placeholder="john@example.com"
    />
    <div className="form-success">First name is valid</div>
  </div>
);
