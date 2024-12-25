import "../styles/Home.css";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import WelcomeImage from "../assets/anime-maid.webp";
import { Link } from "@nextui-org/link";

export const Home = () => {
  return (
    <section className="home-container">
      <div className="home-content-container">
        <h1>Random Anime Images</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque suscipit dicta assumenda iste doloribus ullam sit tempora ut excepturi placeat? Officiis qui ducimus debitis. Quisquam sed porro facilis possimus quis!
        </p>
        <div className="home-button-container">
          <Button as={Link} color="secondary">Get anime SFW Image</Button>
          <Button as={Link} color="danger">Get Anime NSFW Image</Button>
        </div>
      </div>
      <figure className="home-image-container">
        <Image
          alt="Anime Image"
          src={WelcomeImage}
          draggable={false}
        />
      </figure>
    </section>
  )
}
