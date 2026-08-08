import React from 'react';
import './HowToTips.css';

const tips = [
  {
    id: 1,
    title: "Chop Onions Without Tears",
    description: "Use a sharp knife and keep the root end intact until the very last cut — it holds the onion together and slows the release of irritants.",
  },
  {
    id: 2,
    title: "Keep Fresh Herbs Longer",
    description: "Trim the stems and stand them upright in a glass of water. Cover loosely with a bag and refrigerate — they'll last up to two weeks.",
  },
  {
    id: 3,
    title: "Don't Crowd the Pan",
    description: "Give ingredients room to breathe. Overcrowding drops the pan temperature, causing steaming instead of browning.",
  },
  {
    id: 4,
    title: "Use Room-Temperature Ingredients",
    description: "Cold butter or eggs straight from the fridge can break emulsions. Let dairy and eggs rest at room temperature for 30 minutes before baking.",
  },
  {
    id: 5,
    title: "Care for Your Cast Iron",
    description: "Skip the soap. Scrub with coarse salt and a little oil while still warm, then dry thoroughly and apply a thin layer of oil before storing.",
  },
];

const HowToTips = () => {
  return (
    <section className="how-to-tips">
      <div className="how-to-tips__inner">
        <div className="how-to-tips__header">
          <span className="how-to-tips__label">Pro Tips</span>
          <h2 className="how-to-tips__title">Cooking Tips & Tricks</h2>
          <p className="how-to-tips__subtitle">
            Simple techniques that make a real difference in the kitchen.
          </p>
        </div>

        <div className="tips-grid">
          {tips.map((tip) => (
            <div key={tip.id} className="tip-card">
              <span className="tip-card__number">
                {String(tip.id).padStart(2, '0')}
              </span>
              <div className="tip-card__body">
                <h3 className="tip-card__title">{tip.title}</h3>
                <p className="tip-card__desc">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToTips;