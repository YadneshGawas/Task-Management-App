/* eslint-disable no-unused-vars */
import clsx from 'clsx';
import React from 'react';

// eslint-disable-next-line react/prop-types
const Checkbox = ({ type, checked, onChange }) => {
  return (
      <input
        type={type}
        className='form-checkbox h-5 w-5 text-blue-600'
        checked={checked}
        onChange={onChange}
      />
  );
};

export default Checkbox;
