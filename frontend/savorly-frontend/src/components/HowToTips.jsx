import React from 'react';
import './HowToTips.css';

const tips = [
  {
    id: 1,
    title: "How to Perfectly Chop Onions",
    description: "Use a sharp knife and cut off the root end last to avoid tears.",
  },
  {
    id: 2,
    title: "Keep Herbs Fresh Longer",
    description: "Store herbs like flowers in a glass of water in the fridge.",
  },
  {
    id: 3,
    title: "Avoid Overcrowding Your Pan",
    description: "Cook in batches to ensure proper browning and flavor.",
  },
  {
    id: 4,
    title: "Use Room Temperature Ingredients",
    description: "Helps ingredients blend better for fluffier cakes and breads.",
  },
  {
    id: 5,
    title: "Clean Cast Iron Properly",
    description: "Avoid soap; use salt and water to scrub gently.",
  },
];


const HowToTips = () => {
  return (
    <section className="how-to-tips">
      <h2>Cooking Tips & Tricks</h2>
      <div className="tips-container">
        <div className="tip-gif">
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2plbWhpOHc0YW5uNnY4Mm1mdnMyaGljdmlhbmJoNmJzMG11aGZsMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cp115fRF3tQ5P2/giphy.gif"
            alt="Cooking Tip"
          />
        </div>

        <div className="tips-list">
          {tips.map((tip) => (
            <div key={tip.id} className="tip-card">
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToTips;
