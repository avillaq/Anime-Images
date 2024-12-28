import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/image";
import { fetchTags, fetchRandomImage } from "../service/apiService";
import { useAuthStore } from "../store/authStore";
import Heart from "react-heart";
import AnimePlaceholder from "../assets/anime-placeholder.webp";
import "../styles/ImageViewer.css";

export const ImageViewer = ({ type }) => {
  const [category, SetCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");
  const { isAuthenticated } = useAuthStore();

  const [heartActive, setHeartActive] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetchTags();
        const formattedTags = response[type].map((tag) => ({
          key: tag,
          label: tag.charAt(0).toUpperCase() + tag.slice(1),
        }));
        setTags(formattedTags);
      } catch (error) {
        console.error(error);
      }
    }

    getTags();
  }, []);

  const fetchImage = async () => {
    try {
      const response = await fetchRandomImage(type, category);
      setImage(response.image_url);
    } catch (error) {
      console.error(error);
    }
  };

  const addToFavorites = async () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to add images to favorites.");
      return;
    } 
    if (heartActive){
      try {
        alert("Image removed from favorites.");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        alert("Image added to favorites.");
      } catch (error) {
        console.error(error);
      }
    }
    setHeartActive(!heartActive);

  };

  return (
    <section className="image-viewer-container">
      <div className="image-viewer-content-container">
        <h1>Random {type.toUpperCase()} Anime Image</h1>
        <div className="image-viewer-select-container">
          <Select
            variant="bordered"
            color={type === "sfw" ? "secondary" : "danger"}
            className="max-w-xs"
            label="Select a category"
            onChange={(e) => SetCategory(e.target.value)}
            items={tags}
          >
            {(t) => <SelectItem>{t.label}</SelectItem>}
          </Select>
          <Button className="min-w-8" isDisabled={!category} onPress={fetchImage} color={type === "sfw" ? "secondary" : "danger"}>
            Get Image
          </Button>
        </div>
      </div>
      <div className="image-viewer-image-container">
        <div className="image-viewer-action-container">
          <Button color="danger" variant="bordered" isDisabled={!image}>
            <Heart
              isActive={heartActive}
              onClick={() => addToFavorites()}
              animationScale={1.30}
              inactiveColor="white"
              activeColor="red"
            />
          </Button>
          <Button color="secondary" variant="ghost" className="text-inherit" isDisabled={!image}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Download"> <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#f1f1f1" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path> </g> </g></svg>
          </Button>
        </div>
        <figure>
          <Image
            alt="Anime Image Placeholder"
            src={image || AnimePlaceholder}
            draggable={false}
          />
        </figure>
      </div>

    </section>
  )
}
