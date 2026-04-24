"use client";

import { useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  name: string;
  defaultValue: string;
  options: Option[];
  id?: string;
  className?: string;
}

export function SettingsSelect({
  name,
  defaultValue,
  options,
  id,
  className,
}: SettingsSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = () => {
    // Let the browser commit the native selection, then submit the form.
    // Uncontrolled select: React never re-applies a `value` prop, so the
    // user's pick stays visible through parent re-renders.
    selectRef.current?.form?.requestSubmit();
  };

  return (
    <select
      ref={selectRef}
      id={id}
      name={name}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={className}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
