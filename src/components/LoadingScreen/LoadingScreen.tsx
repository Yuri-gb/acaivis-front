import "./LoadingScreen.css";
import mascotSleeping from "../../assets/images/mascot-sleeping.png";

export default function LoadingScreen() {
  return (
    <main className="loading-screen">
      <div className="loading-content">

        <img
          className="loading-mascot"
          src={mascotSleeping}
          alt="Mascote Açaívis dormindo"
        />

        <div className="loading-info">
          <div className="loading-bar">
            <div className="loading-progress" />
          </div>

          <span className="loading-text">
            Carregando...
          </span>
        </div>

      </div>
    </main>
  );
}