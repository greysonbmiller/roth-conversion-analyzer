import { useState } from 'react';

function Tooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        marginLeft: '6px'
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#667eea',
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'help',
          userSelect: 'none'
        }}
      >
        ?
      </span>
      {show && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '10px 12px',
            background: '#1f2937',
            color: 'white',
            fontSize: '13px',
            lineHeight: '1.4',
            borderRadius: '6px',
            whiteSpace: 'normal',
            width: '280px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'none'
          }}
        >
          {text}
          <span
            style={{
              content: '""',
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1f2937'
            }}
          />
        </span>
      )}
    </span>
  );
}

export default Tooltip;
