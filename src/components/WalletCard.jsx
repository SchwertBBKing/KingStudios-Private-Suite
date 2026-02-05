import React, { useState } from "react";
import "./WalletCard.css";
import logo from "../logo.png";

export default function WalletCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="wallet-card-wrapper" onClick={() => setFlipped(!flipped)}>
      <div className={`wallet-card ${flipped ? "is-flipped" : ""}`}>
        {/* Front */}
        <div className="wallet-card__front">
          <div className="wallet-card__brand-text">KingStudios</div>
          <img src={logo} alt="Logo" className="wallet-card__logo-img" />

          <div className="wallet-card__shine" />
          <div className="wallet-card__halo" />
          <div className="wallet-card__noise" />
          <div className="wallet-card__gloss" />

          <div className="wallet-card__chip">
            <div className="wallet-card__chip-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="wallet-card__row">
            <div>
              <div className="wallet-card__label">Member Since</div>
              <div className="wallet-card__value">2010</div>
            </div>
            <div>
              <div className="wallet-card__label">Card Holder</div>
              <div className="wallet-card__value">SchwertBBKing</div>
            </div>
            <div>
              <div className="wallet-card__label">Valid Thru</div>
              <div className="wallet-card__value">13/99</div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="wallet-card__back">
          <div className="wallet-card__magstripe" />
          <div className="wallet-card__cvv">
            <span>CVV</span>
            <strong>742</strong>
          </div>

          <div className="wallet-card__number">3712 34** **** 9017</div>

          <div className="wallet-card__back-text">
            Premium Member • Platinum Access
          </div>
        </div>
      </div>
    </div>
  );
}
