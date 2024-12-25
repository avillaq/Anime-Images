import "../styles/Home.css";
import {Button} from "@nextui-org/button";
import {Image} from "@nextui-org/image";
import WelcomeImage from "../assets/anime-maid.webp";

export const Home = () => {
  return (
    <aside className="home-container">
      <header>
        <h1>Random Anime Images</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque suscipit dicta assumenda iste doloribus ullam sit tempora ut excepturi placeat? Officiis qui ducimus debitis. Quisquam sed porro facilis possimus quis!
        </p>
      </header>
      <main>
        <div className="home-button-container">
          <Button color="secondary">Get sfw Image</Button>
          <Button color="danger">Get nsfw Image</Button>
        </div>
        <div className="home-image-container">
        <Image
          alt="Anime Image"
          src={WelcomeImage}
        />
        </div>

      </main>

      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque suscipit dicta assumenda iste doloribus ullam sit tempora ut excepturi placeat? Officiis qui ducimus debitis. Quisquam sed porro facilis possimus quis!
      
    </aside>
  )
}
