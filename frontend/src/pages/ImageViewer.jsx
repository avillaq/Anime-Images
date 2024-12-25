import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { useState } from "react";
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
  const [category, SetCategory] = useState("cat");

  return (
    <section className="image-viewer-container">
      <h1>Random {type.toUpperCase()} Anime Image</h1>
      <div className="image-viewer-content-container">
        <Select
          variant="bordered"
          isRequired
          className="max-w-xs"
          color={type === "sfw" ? "secondary" : "danger"}
          label={`${type.toUpperCase()} image`}
          placeholder="Select a category"
          onChange={(e) => SetCategory(e.target.value)}
        >
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
        <Button disabled={category ? false : true} onPress={() => alert("Not implemented yet")} color={type === "sfw" ? "secondary" : "danger"}>
          Get Image
        </Button>
      </div>
      <figure className="image-viewer-image-container">
        <Image
          alt="Anime Image"
          src={WelcomeImage}
          draggable={false}
        />
      </figure>
    </section>
  )
}
