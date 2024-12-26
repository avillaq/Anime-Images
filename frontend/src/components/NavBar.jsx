import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { LoginModal } from "./LoginModal";
import "../styles/NavBar.css";
import LogoImage from "../assets/anime-girl-logo.svg";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const menuItems = [
    "Sfw Images",
    "Nsfw Images",
    "Favorites",
    "Log Out",
  ];

  return (
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen} className="navbar-container">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image
            alt="Anime Logo"
            src={LogoImage}
            width={48}
            draggable={false}
          />
          <p className="font-bold text-inherit">Anime Images</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="text-inherit hover:text-secondary-300 transition-colors" href="/image/sfw">
            Sfw Images
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-inherit hover:text-danger-300 transition-colors" href="/image/nsfw">
            Nsfw Images
          </Link>
        </NavbarItem>
{/*         <NavbarItem>
          <Link className="hover:text-danger-600 transition-colors" color="danger" href="/user/favorites">
            Favorites
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button className="text-inherit" color="secondary" variant="light" onPress={onOpen}>
            Login
          </Button>
          <LoginModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
        </NavbarItem>
        <NavbarItem>
          <Button className="text-inherit" color="secondary" variant="ghost" onPress={onOpen}>
            Sign Up
          </Button>
          <LoginModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}/>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="navbar-menu">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-inherit"
              href="/"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

