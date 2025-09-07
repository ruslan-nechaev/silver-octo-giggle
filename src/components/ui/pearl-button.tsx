import React from "react";

type PearlButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export const PearlButton: React.FC<PearlButtonProps> = ({
  label = "Pearl Button",
  className = "",
  ...props
}) => {
  return (
    <>
      <style>{`
        .pearl-button {
          --white: #ffe7ff;
          --bg: #080808;
          --radius: 100px;
          outline: none;
          cursor: pointer;
          border: 0;
          position: relative;
          border-radius: var(--radius);
          background-color: var(--bg);
          background-image: linear-gradient(180deg, #1a1a1a 0%, #0b0b0b 55%, #000000 100%);
          transition: all 0.2s ease;
          box-shadow:
            inset 0 0.35rem 1.25rem rgba(255, 255, 255, 0.55),
            inset 0 -0.12rem 0.5rem rgba(0, 0, 0, 0.9),
            inset 0 -0.55rem 1.1rem rgba(255, 255, 255, 0.7),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            0 3.2rem 3.2rem rgba(0, 0, 0, 0.55),
            0 1.1rem 1.1rem -0.6rem rgba(0, 0, 0, 0.95);
        }
        .pearl-button .wrap {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.85), 0 0 16px rgba(255, 255, 255, 0.18);
          padding: 20px 30px;
          border-radius: inherit;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .pearl-button .wrap { font-size: 26px; padding: 28px 48px; }
        }
        .pearl-button .wrap p span:nth-child(2) { display: none; }
        .pearl-button:hover .wrap p span:nth-child(1) { display: none; }
        .pearl-button:hover .wrap p span:nth-child(2) { display: inline-block; }
        .pearl-button .wrap p {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          transition: all 0.2s ease;
          transform: translateY(2%);
          -webkit-mask-image: linear-gradient(to bottom, white 40%, transparent);
                  mask-image: linear-gradient(to bottom, white 40%, transparent);
        }
        .pearl-button .wrap::before,
        .pearl-button .wrap::after {
          content: "";
          position: absolute;
          transition: all 0.3s ease;
        }
        .pearl-button .wrap::before {
          left: -15%;
          right: -15%;
          bottom: 25%;
          top: -100%;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.16);
        }
        .pearl-button .wrap::after {
          left: 6%;
          right: 6%;
          top: 12%;
          bottom: 40%;
          border-radius: 22px 22px 0 0;
          box-shadow: inset 0 12px 10px -10px rgba(255, 255, 255, 0.9);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        .pearl-button:hover {
          box-shadow:
            inset 0 0.4rem 0.7rem rgba(255, 255, 255, 0.55),
            inset 0 -0.15rem 0.4rem rgba(0, 0, 0, 0.9),
            inset 0 -0.5rem 1.1rem rgba(255, 255, 255, 0.8),
            inset 0 0 0 1px rgba(255, 255, 255, 0.12),
            0 3.2rem 3.2rem rgba(0, 0, 0, 0.6),
            0 1.1rem 1.1rem -0.6rem rgba(0, 0, 0, 1);
        }
        .pearl-button:hover .wrap::before { transform: translateY(-5%); }
        .pearl-button:hover .wrap::after { opacity: 0.5; transform: translateY(5%); }
        .pearl-button:hover .wrap p { transform: translateY(-4%); color: rgba(255,255,255,0.95); }
        .pearl-button:active {
          transform: translateY(4px);
          box-shadow:
            inset 0 0.3rem 0.5rem rgba(255, 255, 255, 0.5),
            inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
            inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.4),
            0 3rem 3rem rgba(0, 0, 0, 0.3),
            0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
        }
      `}</style>

      <button className={`pearl-button ${className}`} {...props}>
        <div className="wrap">
          <p>
            <span>✧</span>
            <span>✦</span>
            {label}
          </p>
        </div>
      </button>
    </>
  );
};

export default PearlButton


