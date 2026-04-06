import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CheckIcon, UserPen, MailIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InputGroupIcon() {
  return (
    <div className="grid w-full max-w-sm gap-6 justify-center items-center bg-">
      <div className="flex flex-col gap-2.5 opacity-55">
        <label className="self-start">Nom d'utilisateur </label>
        <InputGroup>
          <InputGroupInput placeholder="Enter your name" />
          <InputGroupAddon>
            <UserPen />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex flex-col gap-2.5">
        <label className="self-start opacity-55">Email</label>
        <InputGroup>
          <InputGroupInput type="email" placeholder="Enter your email" />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="self-start opacity-55">Mot de passe</label>
        <InputGroup>
          <InputGroupInput placeholder="john123" />
          <InputGroupAddon>
            <LockIcon />
            {/* <CreditCardIcon /> */}
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <CheckIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Button className="bg-green-600"> Valider </Button>
    </div>
  );
}
