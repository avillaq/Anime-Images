import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Form } from "@nextui-org/form";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logIn, signUp, fetchFavorites } from "../service/apiService";

export const LoginSignUpModal = ({ isOpen, onOpenChange, mode }) => {
  const { setAccessToken, setAuthtenticated, setFavorites } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (value, field) => {
    if (!value || value.trim() === "") {
      return `${field} is required`;
    } else if (value.length < 3 && mode !== "login") {
      return `${field} must be at least 3 characters long`;
    } else if (value.length > 8 && mode !== "login") {
      return `${field} must be at most 8 characters long`;
    }
    return value === "admin" ? "Nice try!" : null;
  }

  const resetStates = () => {
    setUsername("");
    setPassword("");
    setErrors({});
    setIsLoading(false);
    onOpenChange();
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    let result = {};
    if (mode === "login") {
      result = await logIn(data);
    } else {
      result = await signUp(data);
    }
    
    if (!result.error) {
      setAccessToken(result.access_token);

      const favorites = await fetchFavorites();
      if (!favorites.error) {
        setFavorites(favorites.favorites.map(f => f.image_url));
      }

      setAuthtenticated();

      console.log(result.message);
      // TODO: Show a toast message: resut.message

      resetStates();
    }

    setErrors(result.error);
    setIsLoading(false);

  };

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={resetStates}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "bg-[#19172c] text-[#fff]",
          header: "border-b-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.1,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{mode === "login" ? "Log in" : "Sign Up"}</ModalHeader>
              <ModalBody>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit} validationErrors={errors}>
                  <Input
                    validate={(value) => validate(value, "Username")}
                    isDisabled={isLoading}
                    label="Username"
                    name="username"
                    placeholder={`Enter ${mode === "login" ? "your" : "an"} username`}
                    variant="bordered"
                    value={username}
                    onValueChange={setUsername}
                    classNames={{
                      inputWrapper: [
                        "border-[#481878]",
                        "data-[hover=true]:border-[#6020a0]",
                        "group-data-[focus=true]:border-[#9353d3]",
                      ],
                    }}
                  />
                  <Input
                    validate={(value) => validate(value, "Password")}
                    isDisabled={isLoading}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder={`Enter ${mode === "login" ? "your" : "a"} password`}
                    variant="bordered"
                    value={password}
                    onValueChange={setPassword}
                    classNames={{
                      inputWrapper: [
                        "border-[#481878]",
                        "data-[hover=true]:border-[#6020a0]",
                        "group-data-[focus=true]:border-[#9353d3]",
                      ],
                    }}
                  />
                  <div className="flex gap-3 mt-6 justify-end w-full">
                    <Button color="danger" variant="light" isDisabled={isLoading} onPress={onClose}>
                      Close
                    </Button>
                    <Button color="secondary" isLoading={isLoading} type="submit">
                    {mode === "login" ? "Sign in" : "Sign Up"}
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}