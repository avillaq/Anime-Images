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
          Discover and collect amazing anime images.
          Browse through different categories including maid, waifu, characters, and more.
          Create an account to save your favorite images and build your personal collection.
          Choose between SFW content or NSFW content based on your preferences.
        </p>
        <div className="home-button-container">
          <Button as={Link} href="/image/sfw" color="secondary">Get anime SFW Image</Button>
          <Button as={Link} href="/image/nsfw" color="danger">Get Anime NSFW Image</Button>
        </div>
      </div>
      <figure className="home-image-container">
        <Image
          alt="Welcome Anime Image"
          src={WelcomeImage}
          draggable={false}
        />
      </figure>
    </section>
  )
}

