"use client";

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px'
    }}>
      <style jsx>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #000000;
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @media (prefers-color-scheme: dark) {
          .spinner {
            border-color: #ffffff;
            border-top-color: #000000;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="spinner"></div>
    </div>
  );
}
