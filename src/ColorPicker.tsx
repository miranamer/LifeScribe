import React from 'react';
import { ChromePicker } from 'react-color';

export default function ColorPicker({ color, onChange }) {
  return (
    <div>
      <ChromePicker color={color} onChange={(color) => onChange(color.hex)} />
    </div>
  );
}