import { useState, forwardRef } from 'react';

/**
 * NeuralInput — glowing focused state, icon support, error display
 */
const NeuralInput = forwardRef(({
  label, type = 'text', placeholder, value, onChange, onKeyDown,
  icon, error, hint, required, disabled, autoComplete, name,
  rightElement, style: extStyle = {},
}, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...extStyle }}>
      {label && (
        <label style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10, fontWeight: 500,
          color: focused ? 'var(--text-accent)' : 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          transition: 'color 0.2s',
          userSelect: 'none',
        }}>
          {label}{required && <span style={{ color: 'var(--plasma)', marginLeft: 3 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? 'var(--plasma)' : 'var(--text-3)',
            transition: 'color 0.2s',
            display: 'flex', alignItems: 'center',
            pointerEvents: 'none',
          }}>
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            padding: icon ? '12px 44px 12px 44px' : rightElement ? '12px 44px 12px 16px' : '12px 16px',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--text-1)',
            background: focused
              ? 'rgba(108,99,255,.05)'
              : 'rgba(10,15,30,.8)',
            border: error
              ? '1px solid rgba(255,107,107,.5)'
              : focused
              ? '1px solid rgba(108,99,255,.5)'
              : '1px solid rgba(255,255,255,.07)',
            borderRadius: 10,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
            boxShadow: focused
              ? error
                ? '0 0 0 3px rgba(255,107,107,.1)'
                : '0 0 0 3px rgba(108,99,255,.12), 0 0 20px rgba(108,99,255,.08)'
              : 'none',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />

        {rightElement && (
          <div style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center',
          }}>
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <div style={{
          fontSize: 12, color: 'var(--flare)',
          display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-mono)',
        }}>
          <span>⚠</span> {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          {hint}
        </div>
      )}
    </div>
  );
});

NeuralInput.displayName = 'NeuralInput';
export default NeuralInput;