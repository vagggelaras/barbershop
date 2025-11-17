import { useState } from 'react';
import '../HomePageStyles/CardStack.css';

export default function CardStack({
    items = [],
    className = ''
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const n = items.length;

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + n) % n);
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % n);
    };

    // Generate random rotation angle for each card
    const getRandomAngle = (index) => {
        const angles = [-12, 8, -5, 10, -8, 6, -10];
        return angles[index % angles.length];
    };

    // Calculate z-index for each card
    const getZIndex = (index) => {
        return ((n - 1 + index - currentIndex) % n);
    };

    return (
        <section
            className={`card-stack ${className}`}
            style={{ '--n': n, '--k': currentIndex }}
        >
            {items.map((item, i) => (
                <article
                    key={i}
                    style={{
                        '--i': i,
                        '--a': `${getRandomAngle(i)}deg`,
                        zIndex: getZIndex(i)
                    }}
                    className={currentIndex === i ? 'top-card' : ''}
                >
                    <h2>{item.name}</h2>
                    <em>{item.role}</em>
                    <img src={item.image} alt={item.name} />
                </article>
            ))}
            <div className="stack-controls">
                <button
                    aria-label="previous"
                    onClick={handlePrev}
                    className="prev-btn"
                />
                <button
                    aria-label="next"
                    onClick={handleNext}
                    className="next-btn"
                />
            </div>
        </section>
    );
}
