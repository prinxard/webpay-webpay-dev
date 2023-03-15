import React from 'react';

export const Select = React.forwardRef((props, ref) => (
  <div className={`form-element ${props.inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">{props.label}</div>
    <select className="form-select" {...props} ref={ref}>
      <option value="2018">2018</option>
      <option value="2019">2019</option>
      <option value="2020">2020</option>
      <option value="2021">2021</option>
    </select>
  </div>
));
export const SelectMda = ({ inline = false, label, ...props }) => (
  <div className={`form-element ${inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">{label}</div>
    <select className="form-select" {...props}>
      <option value="">Select MDA</option>
    </select>
  </div>
);
export const SelectPaymentChannel = ({ inline = false, label, ...props }) => (
  <div className={`form-element ${inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">{label}</div>
    <select className="form-select" {...props}>
      <option value="">Select Payment Channel</option>
    </select>
  </div>
);

export const SelectItem = ({ inline = false, label, ...props }) => (
  <div className={`form-element ${inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">{label}</div>
    <select className="form-select" {...props}>
      <option value="">Select Item</option>
    </select>
  </div>
);

export const SelectMonth = React.forwardRef((props, ref) => (
  <div className={`form-element ${props.inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">{props.label}</div>
    <select className="form-select" {...props} ref={ref}>
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  </div>
));

export const InvalidSelect = ({ inline = false }) => (
  <div className={`form-element ${inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">First name</div>
    <select className="form-select form-select-invalid">
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
      <option>Option 4</option>
    </select>
    <div className="form-error">First name is required</div>
  </div>
);

export const ValidSelect = ({ inline = false }) => (
  <div className={`form-element ${inline ? 'form-element-inline' : ''}`}>
    <div className="form-label">First name</div>
    <select className="form-select form-select-valid">
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
      <option>Option 4</option>
    </select>
    <div className="form-success">First name is valid</div>
  </div>
);
