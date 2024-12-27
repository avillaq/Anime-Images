import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/image";
import { fetchTags, fetchRandomImage } from "../service/apiService";
import AnimePlaceholder from "../assets/anime-placeholder.webp";
import "../styles/ImageViewer.css";

export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];

export const ImageViewer = ({ type }) => {
  const [category, SetCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");

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
      <figure className="image-viewer-image-container">
        <Image
          alt="Anime Image Placeholder"
          src={image || AnimePlaceholder}
          draggable={false}
        />
      </figure>
    </section>
  )
}
