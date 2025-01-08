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
import { LoginSignUpModal } from "./LoginSignUpModal";
import { useAuthStore } from "../store/authStore";
import { logOut } from "../service/apiService";
import "../styles/NavBar.css";
import LogoImage from "../assets/anime-girl-logo.svg";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const LoginModalController = useDisclosure();
  const RegisterModalController = useDisclosure();
  const { isAuthenticated, setLogout } = useAuthStore();

  const menuItems = [
    "Sfw Images",
    "Nsfw Images",
    "Favorites",
    "Log Out",
  ];

  const onLogout = async () => {
    try {
      const response = await logOut();
      console.log(response.message);
      setLogout();
    } catch (error) {
      console.error(error);
    }
  }

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
        {isAuthenticated &&
          <NavbarItem>
            <Link className="hover:text-danger-600 transition-colors" color="danger" href="/user/favorites">
              Favorites
            </Link>
          </NavbarItem>}
      </NavbarContent>
      <NavbarContent justify="end">

        {isAuthenticated ?
          <NavbarItem>
            <Button color="danger" variant="light" className="text-inherit" onPress={onLogout}>
              Log Out
            </Button>
          </NavbarItem>
          :
          <>
            <NavbarItem>
              <Button className="text-inherit" color="secondary" variant="light" onPress={LoginModalController.onOpen}>
                Login
              </Button>
              <LoginSignUpModal mode={"login"} isOpen={LoginModalController.isOpen} onOpenChange={LoginModalController.onOpenChange} />
            </NavbarItem>
            <NavbarItem>
              <Button className="text-inherit" color="secondary" variant="ghost" onPress={RegisterModalController.onOpen}>
                Sign Up
              </Button>
              <LoginSignUpModal mode={"signUp"} isOpen={RegisterModalController.isOpen} onOpenChange={RegisterModalController.onOpenChange} />
            </NavbarItem>
          </>
        }

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