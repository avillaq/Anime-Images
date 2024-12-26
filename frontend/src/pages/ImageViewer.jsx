import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { Image } from "@nextui-org/image";
import WelcomeImage from "../assets/anime-maid.webp";
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
  const [category, SetCategory] = useState();

  return (
    <section className="image-viewer-container">
      <div className="image-viewer-content-container">
        <h1>Random {type.toUpperCase()} Anime Image</h1>
        <div className="image-viewer-select-container">
          <Select
            variant="flat"
            className="max-w-xs"
            label="Select a category"
            onChange={(e) => SetCategory(e.target.value)}
            items={animals}
          >
            {(animal) => <SelectItem>{animal.label}</SelectItem>}
          </Select>
          <Button className="min-w-8" isDisabled={!category} onPress={() => console.log(`${category}`)} color={type === "sfw" ? "secondary" : "danger"}>
            Get Image
          </Button>
        </div>
      </div>
      <figure className="image-viewer-image-container">
        <Image
          alt="Anime Image Placeholder"
          src={WelcomeImage}
          draggable={false}
        />
      </figure>
    </section>
  )
}
