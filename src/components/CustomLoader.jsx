import { Html, useProgress } from "@react-three/drei";

export default function CustomLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="loader-container">
        <div className="loader-content">
          <div className="loader-spinner"></div>
          <div className="loader-text">
            Loading Experience
            <span className="loader-dots">...</span>
          </div>
          <div className="loader-progress">
            <div 
              className="loader-progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loader-percentage">{progress.toFixed(0)}%</div>
        </div>
      </div>
    </Html>
  );
}
